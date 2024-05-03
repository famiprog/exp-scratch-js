import {
  Project,
  Sprite,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

import RoadTileComponent from "../leopard/RoadTileComponent/RoadTileComponent.js";
import RailroadCrossingSignal from "../leopard/RailroadCrossingSignal/RailroadCrossingSignal.js";
import StageExt from "./StageExt.js";
import CityBus from "../leopard/CityBus/CityBus.js";
import Truck from "../leopard/Truck/Truck.js";

const stage = new StageExt({ costumeNumber: 1 });

export const sprites = {
  RoadTileComponent: new RoadTileComponent({
    x: 0,
    y: 0,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 2,
    size: 100,
    visible: false,
    layerOrder: 1,
  }),
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
  RailroadCrossingSignal: new RailroadCrossingSignal({
    x: -223,
    y: 112,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 4,
  }),
};

const project = new Project(stage, sprites, {
  frameRate: 30, // Set to 60 to make your project run faster
});
export default project;