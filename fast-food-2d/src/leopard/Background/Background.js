/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "leopard";

import { SpriteExt } from "../../leopard_ext/libEnhancements/SpriteExt";


export default class Background extends SpriteExt {
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
