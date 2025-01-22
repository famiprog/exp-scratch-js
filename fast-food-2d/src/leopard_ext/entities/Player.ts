import { Costume, Sprite, Trigger } from "leopard";
import { Utils } from "../utils/UtilsTs";
import { ISpriteWithShadow } from "../libEnhancements/ISpriteWithShadow";

export default class Player extends Utils.extendSpriteClass(Sprite) {

  constructor(...args: unknown[]) {
    // @ts-expect-error using args
    super(...args);

    this.costumes = [
      new Costume("costume1", "./cat-costumes/costume1.svg", { x: 48, y: 50 }),
      new Costume("costume2", "./cat-costumes/costume2.svg", { x: 46, y: 53 }),
    ];

    this.sounds = [];

    // @ts-expect-error maybe bad type in API?
    this.triggers = [new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlag)];
  }

  moves = 0;

  *whenGreenFlag() {
    while (true) {
      let moving = false;
      if (this.keyPressed("right arrow")) {
        this.direction = 90;
        this.rotationStyle = Sprite.RotationStyle.ALL_AROUND;
        moving = true;
      } else if (this.keyPressed("left arrow")) {
        this.direction = 270;
        this.rotationStyle = Sprite.RotationStyle.LEFT_RIGHT;
        moving = true;
      } else if (this.keyPressed("up arrow")) {
        this.direction = 0;
        this.rotationStyle = Sprite.RotationStyle.ALL_AROUND;
        moving = true;
      } else if (this.keyPressed("down arrow")) {
        this.direction = 180;
        this.rotationStyle = Sprite.RotationStyle.ALL_AROUND;
        moving = true;
      }

      if (moving) {
        this.move(10);
        this.moves++;
        if (this.moves === 4) {
          this.costumeNumber++;
          this.moves = 0;
        }
      }

      (this as ISpriteWithShadow).shadowBlur = 10 + Math.abs(Math.sin(new Date().getTime() / 1000 * 2)) * 40;
      (this as ISpriteWithShadow).shadowColor = "blue";
      (this as ISpriteWithShadow).shadowChanged = true;
      yield;
    }
  }
}
