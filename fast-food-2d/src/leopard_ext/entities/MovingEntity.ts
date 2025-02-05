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
        this.costumeNumber = costumes[nextCostumeIndex];
        nextCostumeIndex = (++nextCostumeIndex) % costumes.length;
      }
      const shouldContinue = yield;
      if ((x === undefined || y === undefined) && !shouldContinue) {
        break;
      }
    }
    this.stopAllSounds();
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
