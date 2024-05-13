import Wagon from "../leopard/Wagon/Wagon.js";
import { RoadTileExt } from "./RoadTileExt.js";
import { makeVehicleClass } from "./Vehicle.js";

export class WagonExt extends makeVehicleClass(Wagon) {
    lastWagon = false;

    /**
     * @param {RoadTileExt} tile 
     */
    *setcurrenttile(tile) {
        yield* super.setcurrenttile(tile);
        if (this.lastWagon) {
            if (tile.index === 5) {
                yield* window.sprites.rcs1.stop();
            }
            if (tile.index === 37) {
                yield* window.sprites.rcs2.stop();
            }
        }
    }
}