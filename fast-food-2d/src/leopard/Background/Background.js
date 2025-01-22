/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "leopard";

export default class Background extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./TCM_Fast Food Restaurant 01 Dining_No Grid_34x22.jpg", {
        x: 48,
        y: 50,
      }),
    ];

    this.sounds = [];

    this.triggers = [];
  }
}
