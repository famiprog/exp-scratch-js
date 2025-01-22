import { Costume, Stage as StageBase } from "leopard";

export default class Stage extends StageBase {
  constructor(...args: unknown[]) {
    // @ts-expect-error using args
    super(...args);
    this.costumes = [new Costume("backdrop1", "", { x: 0, y: 0 })];
    this.sounds = [];
    this.triggers = [];
  }
}
