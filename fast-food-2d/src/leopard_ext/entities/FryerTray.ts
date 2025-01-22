import { Costume, Sprite, Trigger } from "leopard";
import { Utils } from "../utils/UtilsTs";
import { ISpriteWithShadow } from "../libEnhancements/ISpriteWithShadow";

export default class FryerTray extends Utils.extendSpriteClass(Sprite) {

  fillPercentage = 0;

  constructor(...args: unknown[]) {
    // @ts-expect-error using args
    super(...args);

    this.costumes = [
      new Costume("FryerTray1", "./FryerTray/FryerTray1.png", { x: 28, y: 71 }),
      new Costume("FryerTray2", "./FryerTray/FryerTray2.png", { x: 28, y: 71 }),
      new Costume("FryerTray3", "./FryerTray/FryerTray3.png", { x: 28, y: 71 }),
      new Costume("FryerTray4", "./FryerTray/FryerTray4.png", { x: 28, y: 71 }),
      new Costume("FryerTray5", "./FryerTray/FryerTray5.png", { x: 28, y: 71 }),
    ];

    this.sounds = [];

    // @ts-expect-error maybe issue in API
    this.triggers = [new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlag)];
  }

  *whenGreenFlag() {
    while (true) {
      (this as ISpriteWithShadow).shadowBlur = 10 + Math.abs(Math.sin(new Date().getTime() / 1000 * 2)) * 40;
      (this as ISpriteWithShadow).shadowColor = "red";
      (this as ISpriteWithShadow).shadowChanged = true;

      yield;
    }
  }

  setFillPercentage(value: number) {
    this.fillPercentage = value;
    if (this.fillPercentage <= 0) {
      this.costumeNumber = 1;
    } else if (this.fillPercentage < 25) {
      this.costumeNumber = 2;
    } else if (this.fillPercentage < 50) {
      this.costumeNumber = 3;
    } else if (this.fillPercentage < 75) {
      this.costumeNumber = 4;
    } else {
      this.costumeNumber = 5;
    }
  }

}
