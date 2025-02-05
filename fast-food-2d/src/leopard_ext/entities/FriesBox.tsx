import { Costume } from "leopard";
import { MenuItem } from "semantic-ui-react";
import App from "../../App";
import { Utils } from "../utils/Utils";
import { ActionableEntity } from "./ActionableEntity";
import { ActionableEntityPopup } from "./ActionableEntityPopup";
import Character from "./Character";
import MovingEntity from "./MovingEntity";

export default class FriesBox extends ActionableEntity {

  fillPercentage = 0;

  constructor(...args: unknown[]) {
    //// @ts-expect-error using args
    super(...args);

    this.costumes = [
      new Costume("empty", "./FriesBox/TCM_French Fry Box Side Empty.png", { x: 40, y: 51 }),
      new Costume("full", "./FriesBox/TCM_French Fry Box Side.png", { x: 34, y: 48 }),
    ];

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

  protected showActions() {
    App.INSTANCE.showPopup(() => <FriesBoxPopup entity={this} />);
  }

}

class FriesBoxPopup extends ActionableEntityPopup<FriesBox> {
  protected renderMenuItems() {
    return <MenuItem icon="food" content="Eat" onClick={() => {
      if (!MovingEntity.selectedMovingEntity) {
        return;
      }
      Utils.startGenerator(() => (MovingEntity.selectedMovingEntity as Character).eat(this.props.entity));
    }} />
  }
}
