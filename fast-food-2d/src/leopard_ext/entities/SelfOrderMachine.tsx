import { Costume } from "leopard";
import { MenuItem } from "semantic-ui-react";
import App from "../../App";
import { ActionableEntity } from "./ActionableEntity";
import { ActionableEntityPopup } from "./ActionableEntityPopup";
import Character from "./Character";
import MovingEntity from "./MovingEntity";
import { Utils } from "../utils/Utils";

export default class SelfOrderMachine extends ActionableEntity {

  constructor(...args: unknown[]) {
    //// @ts-expect-error using args
    super(...args);

    this.costumes = [
      new Costume("main", "./SelfOrderMachine/TCM_Restaurant Self Order Machine_1x1.png", { x: 40, y: 16 }),
    ];

    this.direction = -90;
    this.size = 70;
  }

  protected showActions() {
    App.INSTANCE.showPopup(() => <SelfOrderMachinePopup entity={this} />);
  }
}

class SelfOrderMachinePopup extends ActionableEntityPopup<SelfOrderMachine> {
  protected renderMenuItems() {
    return <MenuItem icon="food" content="Order 1 fries box" onClick={() => {
      (MovingEntity.selectedMovingEntity as Character).hunger++;
      Utils.startGenerator(() => MovingEntity.selectedMovingEntity?.sayAndWait("I'm hungrier", 2));
    }} />
  }
}