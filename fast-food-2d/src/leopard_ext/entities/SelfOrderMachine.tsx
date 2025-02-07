import { Costume } from "leopard";
import { ActionableEntity } from "./ActionableEntity";
import { ActionsMenu } from "./ActionsMenu";
import Character from "./Character";

export default class SelfOrderMachine extends ActionableEntity {

  constructor(...args: unknown[]) {
    //// @ts-expect-error using args
    super(...args);

    this.costumes = [
      new Costume("main", "./SelfOrderMachine/TCM_Restaurant Self Order Machine_1x1.png", { x: 40, y: 16 }),
    ];

    this.direction = -90;
    this.size = 70;

    this.actionsMenu = new ActionsMenu(this, [], ["orderFriesGen"]);
  }

  *orderFriesGen(character: Character) {
    yield* character.beHungrierGen();
  }

}
