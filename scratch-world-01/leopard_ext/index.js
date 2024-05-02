import {
  Project,
  Sprite,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

import Stage from "../leopard/Stage/Stage.js";
import Sprite1 from "../leopard/Sprite1/Sprite1.js";
import Sprite2 from "../leopard/Sprite2/Sprite2.js";
import RoadTile from "../leopard/RoadTile/RoadTile.js";
import RoadTileExt from "./RoadTileExt.js";
import CityBus from "../leopard/CityBus/CityBus.js";
import CityBusExt from "./CityBusExt.js";

const stage = new Stage({ costumeNumber: 1 });

const sprites = {
  Sprite1: new Sprite1({
    x: -174,
    y: 128,
    direction: 180,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 4,
  }),
  Sprite2: new Sprite2({
    x: -229,
    y: 170,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 3,
  }),
  RoadTile: new RoadTileExt({
    x: 0,
    y: 0,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 2,
    size: 100,
    visible: false,
    layerOrder: 1,
  }),
  CityBus: new CityBusExt({
    x: -180,
    y: -121,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 30,
    visible: true,
    layerOrder: 4,
  }),
};

const project = new Project(stage, sprites, {
  frameRate: 30, // Set to 60 to make your project run faster
});
export default project;