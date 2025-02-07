import { Costume } from "leopard";
import { ActionableEntity } from "./ActionableEntity";
import FriesBox from "./FriesBox";
import { FryerTrayActionsMenu } from "./FryerTrayActionsMenu";

export default class FryerTray extends ActionableEntity {

  fillPercentage = 0;

  constructor(...args: unknown[]) {
    //// @ts-expect-error using args
    super(...args);

    this.costumes = [
      new Costume("FryerTray1", "./FryerTray/FryerTray1.png", { x: 56, y: 142 }),
      new Costume("FryerTray2", "./FryerTray/FryerTray2.png", { x: 56, y: 142 }),
      new Costume("FryerTray3", "./FryerTray/FryerTray3.png", { x: 56, y: 142 }),
      new Costume("FryerTray4", "./FryerTray/FryerTray4.png", { x: 56, y: 142 }),
      new Costume("FryerTray5", "./FryerTray/FryerTray5.png", { x: 56, y: 142 }),
    ];

    this.actionsMenu = new FryerTrayActionsMenu(this, ["fillPercentage"], ["setEmpty", "setFull", "createFriesBox"]);
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

  setEmpty() {
    this.setFillPercentage(0);
  }

  setFull() {
    this.setFillPercentage(100);
  }

  createFriesBox() {
    const fb = new FriesBox().addToProject(0, 0);
    fb.setFillPercentage(100);
  }

}
