import {
  Project,
  Sprite,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

import CityBus from "../leopard/CityBus/CityBus.js";
import Truck from "../leopard/Truck/Truck.js";
import StageExt from "./StageExt.js";

const stage = new StageExt({ costumeNumber: 1 });

// keeping these 2 vehicles for the moment, to remember the "classic" way of adding sprites in leopard
export const sprites = {
  CityBus: new CityBus({
    x: -180,
    y: -121,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 30,
    visible: true,
    layerOrder: 4,
  }),
  Truck: new Truck({
    x: -169,
    y: -150,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 2,
    size: 30,
    visible: true,
    layerOrder: 5,
  }),
};

export const project = new class extends Project {

  /**
   * @type {Generator[]}
   */
  runningGenerators = [];

  step() {
    super.step();
    let i = 0;
    while (i < this.runningGenerators.length) {
      const generator = this.runningGenerators[i];
      const done = generator.next().done;
      if (done) {
        this.runningGenerators.splice(i, 1);
      } else {
        i++;
      }
    }
  }

}(stage, sprites, {
  frameRate: 30, // Set to 60 to make your project run faster
});
export default project;

project.sprites = { ...project.sprites };