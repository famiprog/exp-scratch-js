import CityBus from "../leopard/CityBus/CityBus.js";
import { RoadTileExt } from "./RoadTileExt.js";
import { makeVehicleClass } from "./Vehicle.js";

export class LocomotiveExt extends makeVehicleClass(CityBus) {

    wagon1;
    wagon2;
    wagon3;

    /**
     * @param {number} pixelsToMove 
     */
    *move(pixelsToMove) {
        yield* super.move(pixelsToMove);
        this.wagon1 && (yield* this.wagon1.move(pixelsToMove));
        this.wagon2 && (yield* this.wagon2.move(pixelsToMove));
        this.wagon3 && (yield* this.wagon3.move(pixelsToMove));
    }

    /**
     * @param {RoadTileExt} tile 
     */
    *setcurrenttile(tile) {
        yield* super.setcurrenttile(tile);
        if (tile.index === 0) {
            yield* window.sprites.rcs1.start();
        }
        if (tile.index === 33) {
            yield* window.sprites.rcs2.start();
        }

    }
}