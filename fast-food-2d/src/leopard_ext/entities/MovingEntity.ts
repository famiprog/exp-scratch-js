import { Sound, Trigger } from "leopard";
import { Yielding } from "leopard/dist/lib/yielding";
import { SpriteExt } from "../libEnhancements/SpriteExt";
import { Utils } from "../utils/Utils";

export default class MovingEntity extends SpriteExt {

  static movingEntities: MovingEntity[] = [];
  static selectedMovingEntity?: MovingEntity;

  selected = false;
  walkingCostumesNormal?: number[];
  walkingCostumesFlip?: number[];

  stopPreviousFunctionExecutionHelper = new StopPreviousFunctionExecutionHelper();

  constructor(...args: unknown[]) {
    // @ts-expect-error using args
    super(...args);

    // @ts-expect-error maybe issue in API
    this.triggers.push(new Trigger(Trigger.CLICKED, this.whenClicked));

    this.sounds.push(new Sound("select", "./Wood Tap.wav"));

    this.setSelected(false);
    MovingEntity.movingEntities.push(this);
  }

  setSelected(value: boolean) {
    if (this.selected === value) {
      return;
    }
    if (value) {
      this.setShadow(30, "green");
      Utils.startGenerator(() => this.walkWithKeysLoop());
    } else {
      this.setShadow(70, "orange");
      // walkWithKeysLoop will die on next iteration, because selected is false
    }
    this.selected = value;
    MovingEntity.selectedMovingEntity = this;
  }

  *whenClicked() {
    if (!this.selected) {
      for (const c of MovingEntity.movingEntities) {
        c.setSelected(false);
      }
      this.setSelected(true);
      yield* this.startSound("select");
    }

    Utils.mouseClickProcessedInScratch = true;

    yield;
  }

  protected *playWalkSound(): Yielding<void> {
    // nop
    yield;
  }

  *walk(x: number, y: number): Generator<void, void, void> {
    // @ts-expect-error it has next as void; this as boolean; but it's OK
    yield* this.walkInternal(x, y);
  }

  /**
   * @param x if undefined => moving w/ keys
   * @param y idem
   */
  protected *walkInternal(x?: number, y?: number): Generator<void, void, boolean> {
    const my = yield* this.stopPreviousFunctionExecutionHelper.begin();
    if (my === undefined) {
      return;
    }

    // @ts-expect-error it has next as void; this as boolean; but it's OK
    yield* this.playWalkSound();
    if (x !== undefined && y !== undefined) {
      this.direction = this.radToScratch(Math.atan2(y - this.y, x - this.x));
    } // else moving w/ keys

    const walkingCostumesNormal = this.walkingCostumesNormal || [this.costumeNumber];
    const walkingCostumesFlip = this.walkingCostumesFlip || [this.costumeNumber];

    const normal = this.direction >= 0 && this.direction <= 180;

    let iter = 0;
    let nextCostumeIndex = 0;
    while (x === undefined || y === undefined
      ? true // exit condition will be at end of loop
      : Math.hypot(this.x - x, this.y - y) > 10) {

      this.move(10);
      if (!(iter++ % 4)) {
        const costumes = normal ? walkingCostumesNormal : walkingCostumesFlip;
        // w/o this, I would have a flicker sometimes
        this.shadowChanged = true;
        this.costumeNumber = costumes[nextCostumeIndex];
        nextCostumeIndex = (++nextCostumeIndex) % costumes.length;
      }
      const shouldContinue = yield;
      if ((x === undefined || y === undefined) && !shouldContinue) {
        break;
      }
      if (this.stopPreviousFunctionExecutionHelper.shouldBreakLoop(my)) {
        return;
      }
    }
    this.stopAllSounds();

    this.stopPreviousFunctionExecutionHelper.end(my);
  }

  protected *walkWithKeysLoop() {
    let generatorWalk: Generator<void, void, boolean> | undefined = undefined;
    let previousDirection = this.direction;
    while (this.selected) {
      let newDirection: number | undefined = undefined;
      if (this.keyPressed("right arrow")) {
        newDirection = 90;
      } else if (this.keyPressed("left arrow")) {
        newDirection = -90;
      } else if (this.keyPressed("up arrow")) {
        newDirection = 0;
      } else if (this.keyPressed("down arrow")) {
        newDirection = -180;
      }

      if (newDirection === undefined  // now not walking
        || previousDirection !== newDirection) { // was walking; now walking in another direction
        // stop the old generator, if exists
        generatorWalk?.next(false);
        generatorWalk = undefined;
      }
      if (newDirection !== undefined && !generatorWalk) { // is walking, and was walking in another direction
        generatorWalk = this.walkInternal();
        this.direction = previousDirection = newDirection;

      } // else either nothing pressed, or same key pressed

      generatorWalk?.next(true);

      yield;
    }
  }
}

/**
 * In the context of a function that can be started from multiple "threads" (i.e. not all generators belonging to a single main loop),
 * we want to stop the previous function, before continuing. There is also the case where during the stopping phase (when someone waits), 
 * somebody else invokes. So for call A, B, C: B will order stop and it won't run.
 */
class StopPreviousFunctionExecutionHelper {

  /**
   * State off; after a normal run.
   */
  walkSession = 0;

  *begin() {
    const observedWalkSession = this.walkSession;
    // e.g. 0 => 1, was off, and now will walk
    // 3 => 4, // was walking, so it will stop, and it will continue here; changing this will lead to breaking the loop of 3
    // -8 => 9 // call/session 8 requested a stop, which happened; but before 8 can continue, this was called again, hence here I am
    const myWalkSession = this.walkSession = Math.abs(this.walkSession) + 1;
    // console.log("start", myWalkSession);
    
    // walk in progress
    if (observedWalkSession > 0) {
      // console.log("pre waiting", this.walkSession, myWalkSession)

      // let's wait until we see a change
      while (this.walkSession === myWalkSession) {
        // console.log("waiting", this.walkSession)
        yield;
      }
      // console.log("finished waiting", this.walkSession)
      // a change happened; 

      if (-this.walkSession != myWalkSession) {
        // but maybe while I was waiting, somebody else requested as well; in this case, I abandon
        return undefined;
      } else {
        // it was my request; so I will continue
        this.walkSession = -this.walkSession;
      }

      // console.log("continuing after waiting", this.walkSession)
    }
    return myWalkSession;
  } // else walk not in progress; either 0 or another call was just stopped

  shouldBreakLoop(myWalkSession: number) {
    // e.g. 3 !== 4 or 3 !== 5; so I exit communicating what was the break signal (by changing sign); because maybe we have 2 requesters
    if (this.walkSession !== myWalkSession) {
      // console.log("forced exit", myWalkSession, "requested by", this.walkSession)
      this.walkSession = -this.walkSession;
      return true;
    }
    return false;
  }

  end(myWalkSession: number) {
    if (this.walkSession !== myWalkSession) {
      // console.log("forced exit DOWN", myWalkSession, "requested by", this.walkSession)
      // I observed corner cases when the new call would come right when the previous call has just stopped normally;
      // I need this; because if I return 0, the next call would not work; it has requested a stop; neither the stop comes, nor a change
      this.walkSession = -this.walkSession;
    } else {
      // console.log("normal exit", myWalkSession);
      this.walkSession = 0;
    }
  }
}
