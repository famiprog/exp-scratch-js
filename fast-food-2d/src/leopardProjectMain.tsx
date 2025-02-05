import "leopard/dist/index.min.css";
import { ProjectExt } from "./leopard_ext/libEnhancements/ProjectExt";
import Stage from "./leopard_ext/Stage";
// @ts-expect-error js in ts
import Background from "./leopard/Background/Background";
import Character from "./leopard_ext/entities/Character";
import FryerTray from "./leopard_ext/entities/FryerTray";
import SelfOrderMachine from "./leopard_ext/entities/SelfOrderMachine";
// @ts-expect-error js in ts
import { ViewportTransform } from "./leopard_ext/utils/ViewportTransform";
import { Utils } from "./leopard_ext/utils/Utils";

export const STAGE_WIDTH = 1960;
export const STAGE_HEIGHT = 800;

let project: ProjectExt;

export function getProject() {
  return project;
}

export function createProjet() {
  const stage = new Stage({ width: STAGE_WIDTH, height: STAGE_HEIGHT, costumeNumber: 1 });
  const sprites = {};

  project = new ProjectExt(stage, sprites, {
    frameRate: 30, // Set to 60 to make your project run faster
  });
  // TODO: de ce era necesara copia?
  project.sprites = { ...project.sprites };

  // TODO: dar astea, la ce trebuiau?
  // @ts-expect-error untyped
  window.stage = stage;
  // @ts-expect-error untyped
  window.sprites = project.sprites

  init();

  project.attach("#project");
  project.greenFlag();

  return project;
}

function init() {
  new Background().addToProject(-STAGE_WIDTH / 2, STAGE_HEIGHT, { name: "bg" });

  const cook = new Character().addToProject(0, 0);
  Utils.startGenerator(() => cook.walk(652, -299));

  new SelfOrderMachine().addToProject(186, 89);
  new SelfOrderMachine().addToProject(328, 89);
  new SelfOrderMachine().addToProject(259, 20);

  const s = new FryerTray().addToProject(700, -320);
  s.direction = -180;

  ViewportTransform.instance.setSpriteForSizeFineAdjustment(s);
}