import "leopard/dist/index.min.css";
import { ProjectExt } from "./leopard_ext/libEnhancements/ProjectExt.ts";
import Stage from "./leopard_ext/Stage.ts";
// @ts-expect-error js in ts
import { Utils } from "./leopard_ext/utils/Utils.js";
// @ts-expect-error js in ts
import Background from "./leopard/Background/Background.js";
import Player from "./leopard_ext/entities/Player.ts";
import FryerTray from "./leopard_ext/entities/FryerTray.ts";
//// @ts-expect-error js in ts
// import { ViewportTransform } from "./leopard_ext/utils/ViewportTransform";

export const STAGE_WIDTH = 1960;
export const STAGE_HEIGHT = 800;

const stage = new Stage({ width: STAGE_WIDTH, height: STAGE_HEIGHT, costumeNumber: 1 });

export const sprites = {};

export const project = new ProjectExt(stage, sprites, {
  frameRate: 30, // Set to 60 to make your project run faster
});

export default project;

// TODO: de ce era necesara copia?
project.sprites = { ...project.sprites };

// TODO: dar astea, la ce trebuiau?
// @ts-expect-error untyped
window.stage = stage;
// @ts-expect-error untyped
window.sprites = project.sprites

const BackgroundExt = Utils.extend(Background);
Utils.addToProject(project, new BackgroundExt(), -STAGE_WIDTH / 2, STAGE_HEIGHT, { name: "bg" });

Utils.addToProject(project, new Player(), 0, 0);

Utils.addToProject(project, new FryerTray(), 20, 220);

// ViewportTransform.instance.setSpriteForSizeFineAdjustment(s);

// while (true) {
//   // s.move(10);
//   // if (s.x > 400) {
//   //     s.direction = 270;
//   // } else if (s.x < -400) {
//   //     s.direction = 90;
//   // }
//   s.shadowBlur = 10 + Math.abs(Math.sin(new Date().getTime() / 1000 * 2)) * 40;
//   s.shadowColor = "blue";
//   s.shadowChanged = true;
//   yield;
// }

project.attach("#project");
project.greenFlag();

