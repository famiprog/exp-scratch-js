import { RoadTileExt, TileMovementController } from "./RoadTileExt.js"
import { Utils } from "./Utils.js";

export function makeVehicleClass(spriteClass) {
    return class extends Utils.extend(spriteClass) {

        /**
         * @param {RoadTileExt} tile 
         * @param {import("./types").CardinalPoint} enteredThrough 
         */
        *putOnRoadTile(tile, enteredThrough) {
            yield* this.setcurrenttile(tile);
            this.vars.currentTileEnteredThrough = enteredThrough;
            yield* this.move(0);
        }

        /**
         * @param {number} pixelsToMove 
         */
        *move(pixelsToMove) {
            yield* TileMovementController.get(this.vars.currentTile).move(this.vars.currentTile, this, pixelsToMove);
        }

        /**
         * @param {RoadTileExt} tile 
         */
        *setcurrenttile(tile) {
            this.vars.currentTile = tile;
        }
    }
}