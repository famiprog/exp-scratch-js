import { Costume } from "leopard";
import { ActionableEntity } from "./ActionableEntity";
import { ActionsMenu } from "./ActionsMenu";
import Character from "./Character";

export default class FriesBox extends ActionableEntity {

  fillPercentage = 0;

  constructor(...args: unknown[]) {
    //// @ts-expect-error using args
    super(...args);

    this.costumes = [
      new Costume("empty", "./FriesBox/TCM_French Fry Box Side Empty.png", { x: 40, y: 51 }),
      new Costume("full", "./FriesBox/TCM_French Fry Box Side.png", { x: 34, y: 48 }),
    ];

    this.actionsMenu = new ActionsMenu(this, ["fillPercentage"], ["beEatenGen"]);

  }

  setFillPercentage(value: number) {
    this.fillPercentage = value;
    if (this.fillPercentage <= 0) {
      this.costumeNumber = 1;
      // } else if (this.fillPercentage < 25) {
      //   this.costumeNumber = 2;
      // } else if (this.fillPercentage < 50) {
      //   this.costumeNumber = 3;
      // } else if (this.fillPercentage < 75) {
      //   this.costumeNumber = 4;
    } else {
      this.costumeNumber = 2;
    }
  }

  *beEatenGen(character: Character) {
    yield* character.eatGen(this);
  }
}
