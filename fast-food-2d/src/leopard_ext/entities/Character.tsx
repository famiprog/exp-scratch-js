import { Costume, Sound } from "leopard";
import { SpriteExt } from "../libEnhancements/SpriteExt";
import { ActionsMenu } from "./ActionsMenu";
import MovingEntity from "./MovingEntity";

export default class Character extends MovingEntity {

  hunger = 0;

  protected actionsMenu: ActionsMenu;

  constructor(...args: unknown[]) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./cat-costumes/costume1.svg", { x: 48, y: 50 }),
      new Costume("costume2", "./cat-costumes/costume2.svg", { x: 46, y: 53 }),
      new Costume("costume1-flip-rotate", "./cat-costumes/costume1-flip-rotate.svg", { x: 48, y: 50 }),
      new Costume("costume2-flip-rotate", "./cat-costumes/costume2-flip-rotate.svg", { x: 46, y: 53 }),
    ];

    this.sounds = [...this.sounds,
    new Sound("Doorbell", "./Character/Doorbell.wav"),
    new Sound("Footsteps", "./Character/Footsteps.wav"),
    new Sound("Yummy", "./Character/Yummy.wav"),
    ];

    this.walkingCostumesNormal = [1, 2];
    this.walkingCostumesFlip = [3, 4];

    this.actionsMenu = new ActionsMenu(this, ["hunger"], ["beHungrierGen"]);
  }

  *onRightClick() {
    this.actionsMenu.show(this);
    yield* this.whenClicked();
  }

  *whenClicked() {
    yield* super.whenClicked();
  }

  protected *playWalkSound() {
    yield* this.startSound("Footsteps");
  }

  *eatGen(entity: SpriteExt) {
    if (this.hunger <= 0) {
      yield* this.sayAndWait("I'm not hungry", 2);
      return;
    }
    this.hunger--;
    entity.dispose();
    yield* this.startSound("Yummy");
    yield* this.sayAndWait("I'm less hungry", 2);
  }

  *beHungrierGen() {
    this.hunger++;
    yield* this.sayAndWait("I'm hungrier", 2)
  }

}
