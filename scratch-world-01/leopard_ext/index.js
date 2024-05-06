import {
  Project,
  Sprite,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

import RoadTileComponent from "../leopard/RoadTileComponent/RoadTileComponent.js";
import StageExt from "./StageExt.js";
import CityBus from "../leopard/CityBus/CityBus.js";
import Truck from "../leopard/Truck/Truck.js";
import ColoredCircle from "../leopard/ColoredCircle/ColoredCircle.js";
import RailroadCrossingSignalExt from "./RailroadCrossingSignalExt.js";
import IsometricHouse from "../leopard/IsometricHouse/IsometricHouse.js";
import IsometricHouse2 from "../leopard/IsometricHouse2/IsometricHouse2.js";
import Tree from "../leopard/Tree/Tree.js";

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
  RailroadCrossingSignal: new RailroadCrossingSignalExt({
    x: -223.06965305659534,
    y: 44.50947541833381,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: false,
    layerOrder: 1,
  }),
  IsometricHouse: new IsometricHouse({
    x: -133,
    y: 79,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 1,
  }),
  IsometricHouse2: new IsometricHouse2({
    x: -50,
    y: 73,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 1,
  }),
};

export const project = new Project(stage, sprites, {
  frameRate: 30, // Set to 60 to make your project run faster
});
export default project;

project.sprites = { ...project.sprites };

export class ColoredCircledMP extends ColoredCircle {
  constructor(initialConditions = {}, vars = {}) {
    Object.assign(initialConditions, {
      x: 0,
      y: 0,
      direction: 90,
      rotationStyle: Sprite.RotationStyle.ALL_AROUND,
      costumeNumber: 1,
      size: 100,
      visible: true,

      layerOrder: 2,
    });
    super(initialConditions, vars);
  }
}

export class TreeMP extends Tree {
  constructor(initialConditions = {}, vars = {}) {
    Object.assign(initialConditions, {
      x: 0,
      y: 0,
      direction: 90,
      rotationStyle: Sprite.RotationStyle.ALL_AROUND,
      costumeNumber: 1,
      size: 100,
      visible: true,

      layerOrder: 2,
    });
    super(initialConditions, vars);
  }
}