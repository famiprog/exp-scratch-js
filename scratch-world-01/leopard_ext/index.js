import {
  Project,
  Sprite,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

import CityBus from "../leopard/CityBus/CityBus.js";
import Truck from "../leopard/Truck/Truck.js";
import StageExt from "./StageExt.js";
import Buttonmove from "../leopard/Buttonmove/Buttonmove.js";
import Buttonstartstop from "../leopard/Buttonstartstop/Buttonstartstop.js";

const stage = new StageExt({ costumeNumber: 1 });

export const sprites = {
  // Truck: new Truck({
  //   x: -169,
  //   y: -150,
  //   direction: 90,
  //   rotationStyle: Sprite.RotationStyle.ALL_AROUND,
  //   costumeNumber: 2,
  //   size: 30,
  //   visible: true,
  //   layerOrder: 5,
  // }),
  Buttonmove: new Buttonmove({
    x: -200,
    y: 176,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 2,
    size: 100,
    visible: true,
    layerOrder: 10,
  }),
  Buttonstartstop: new Buttonstartstop({
    x: -114.3628179364716,
    y: 176.39042617637676,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 12,
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

window.stage = stage;
window.sprites = project.sprites