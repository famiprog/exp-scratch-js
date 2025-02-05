import { Costume } from "leopard";
import MovingEntity from "./MovingEntity";

// export default class Hat extends SpriteExt {
export default class Hat extends MovingEntity {

  constructor(...args: unknown[]) {
    // // @ts-expect-error using args
    super(...args);

    this.costumes = [
      new Costume("Hat", "./Hat.svg", { x: 40, y: 16 }),
    ];
  }

}
