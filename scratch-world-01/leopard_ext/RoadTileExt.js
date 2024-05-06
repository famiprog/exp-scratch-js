import RoadTile from "../leopard/RoadTile/RoadTile.js";
import { Utils } from "./Utils.js";
import { ViewportTransform } from "./ViewportTransform.js";

/**
 * @typedef {import("./types.js").CardinalPoint} CardinalPoint
 * @typedef {import("./types.js").IVehicle} IVehicle
 * @typedef {"h" | "v" | "br" | "tr" | "tl" | "bl"} RoadTileType
 */

const TILE_SIZE = 16;
const OPPOSITE = { w: "e", e: "w", n: "s", s: "n" };

export class RoadTileExt extends Utils.extend(RoadTile) {

    /**
     * @type {{ [key: CardinalPoint]: RoadTileExt }}
     */
    neighbours = {};

    /**
     * @type {RoadTileType}
     */
    type;

    /**
     * @type {number}
     */
    x_untransformed;

    /**
     * @type {number}
     */
    y_untransformed;

    /**
     * @param {RoadTileType} type 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(type, x, y) {
        super();
        this.type = type;
        this.costume = type;

        this.x_untransformed = x;
        this.y_untransformed = y;
    }

    /**
     * @param {RoadTileType} type 
     * @param {CardinalPoint | undefined} cardinalPoint 
     */
    add(type, cardinalPoint) {
        const controller = TileMovementController.get(this);
        if (cardinalPoint) {
            // validate that the cardinal point
            if (controller.cardinalPoints[0] !== cardinalPoint && controller.cardinalPoints[1] !== cardinalPoint) {
                throw new Error(`One wants to add a new tile at: ${cardinalPoint}, but this tile only supports: ${controller.cardinalPoints}`);
            }
        } else {
            // let's find the empty spot
            for (let i = 0; i < controller.cardinalPoints.length; i++) {
                if (!this.neighbours[controller.cardinalPoints[i]]) {
                    if (cardinalPoint) {
                        throw new Error("Cannot deduct the cardinal point. More than one cardinal point is empty. Please specify one explicitly.");
                    }
                    cardinalPoint = controller.cardinalPoints[i];
                }
            }
            if (!cardinalPoint) {
                throw new Error("Cannot deduct the cardinal point. All are occupied.");
            }
        }
        let newX = this.x_untransformed;
        let newY = this.y_untransformed;
        if (cardinalPoint === "e") { newX += TILE_SIZE }
        else if (cardinalPoint === "w") { newX -= TILE_SIZE }
        else if (cardinalPoint === "n") { newY += TILE_SIZE }
        else if (cardinalPoint === "s") { newY -= TILE_SIZE }
        const newTile = new RoadTileExt(type, newX, newY);
        Utils.addToProject(this._project, newTile, newX, newY);

        if (TileMovementController.get(newTile).cardinalPoints[0] !== OPPOSITE[cardinalPoint] && TileMovementController.get(newTile).cardinalPoints[1] !== OPPOSITE[cardinalPoint]) {
            throw new Error("The new tile is not compatible. Expecting it to have one of its cardinal points = " + OPPOSITE[cardinalPoint]);
        }
        this.neighbours[cardinalPoint] = newTile;
        newTile.neighbours[OPPOSITE[cardinalPoint]] = this;
        return newTile;
    }

    /**
     * @param {number} n 
     * @param {(tile: RoadTileExt, i: number) => RoadTileExt} callback 
     * @returns {RoadTileExt}
     */
    repeat(n, callback) {
        let result = this;
        for (let i = 0; i < n; i++) {
            result = callback(result, i);
        }
        return result;
    }
}

export class TileMovementController {

    /**
     * @type {{[key: RoadTileType]: TileMovementController}}
     */
    static instances;

    /**
     * @param {RoadTileExt} tile 
     * @returns {TileMovementController}
     */
    static get(tile) {
        const result = this.instances[tile.type];
        if (!result) {
            throw new Error("Unknown type: " + tile.type);
        }
        return result;
    }

    /**
     * @type {number}
     */
    length = TILE_SIZE;

    /**
     * @type {[CardinalPoint, CardinalPoint]}
     */
    cardinalPoints;

    /**
     * @param {RoadTileExt} tile
     * @param {IVehicle} vehicle 
     * @param {number} pixelsToMove 
     */
    move(tile, vehicle, pixelsToMove) {
        const updated = this.getUpdatedPosition(vehicle, pixelsToMove);
        if (!updated.exitThrough) {
            // e.g. for we, len = 16, pos = 15
            vehicle.vars.currentTilePosition = updated.newPosition;
            const xy = this.getScreenCoordinates(tile, vehicle);
            ViewportTransform.instance.setCoordinates(vehicle, xy[0], xy[1]);
            // console.log("tile", tile.type, tile.x, tile.y, "entered", vehicle.vars.currentTileEnteredThrough, "pos", vehicle.vars.currentTilePosition, "new xy", xy);
        } else {
            // e.g. for we, len = 16, pos = 17 or len = 16, pos = 16
            /**
             * @type {RoadTileExt}
             */
            const nextTile = tile.neighbours[updated.exitThrough];
            if (!nextTile) {
                throw new Error("Neighbor not found. Exiting through: " + updated.exitThrough);
            }
            vehicle.vars.currentTile = nextTile;
            vehicle.vars.currentTilePosition = updated.newPosition;
            vehicle.vars.currentTileEnteredThrough = OPPOSITE[updated.exitThrough];
            TileMovementController.get(nextTile).move(nextTile, vehicle, updated.remaining);
        }
    }

    /**
     * @param {IVehicle} vehicle 
     * @param {number} pixelsToMove 
     * @returns {{ newPosition: number, remaining: number, exitThrough?: CardinalPoint }}
     */
    getUpdatedPosition(vehicle, pixelsToMove) {
        let currentTilePosition = vehicle.vars.currentTilePosition;
        if (vehicle.vars.currentTileEnteredThrough === this.cardinalPoints[0]) {
            if (isNaN(currentTilePosition)) {
                // i.e. just entered
                currentTilePosition = 0;
            }
            const newPosition = currentTilePosition + pixelsToMove;
            if (newPosition < this.length) {
                return { newPosition, remaining: 0 };
            } else {
                return { newPosition: NaN, remaining: newPosition - this.length, exitThrough: this.cardinalPoints[1] };
            }
        } else if (vehicle.vars.currentTileEnteredThrough === this.cardinalPoints[1]) {
            if (isNaN(currentTilePosition)) {
                // i.e. just entered
                currentTilePosition = this.length;
            }
            const newPosition = currentTilePosition - pixelsToMove;
            if (newPosition >= 0) {
                return { newPosition, remaining: 0 };
            } else {
                return { newPosition: NaN, remaining: -newPosition, exitThrough: this.cardinalPoints[0] };
            }
        } else {
            throw new Error(`Illegal state. Entering through: ${vehicle.vars.currentTileEnteredThrough}, but current tile has: ${this.cardinalPoints}`)
        }
    }

    /**
     * @param {RoadTileExt} tile
     * @param {import("./types.js").IVehicle} vehicle 
     * @returns {[number, number]}
     */
    getScreenCoordinates(tile, vehicle) {
        // throw new Error("Not implemented");
        return [-100, 150];
    }
}

class TMC_WE extends TileMovementController {

    cardinalPoints = ["w", "e"];

    getScreenCoordinates(tile, vehicle) {
        return [tile.x_untransformed + vehicle.vars.currentTilePosition, tile.y_untransformed - TILE_SIZE / 2];
    }

}

class TMC_NS extends TileMovementController {

    cardinalPoints = ["s", "n"];

    getScreenCoordinates(tile, vehicle) {
        return [tile.x_untransformed + TILE_SIZE / 2, tile.y_untransformed + vehicle.vars.currentTilePosition - TILE_SIZE];
    }

}

class TMC_Diagonal extends TileMovementController {
    length = Math.sqrt(2 * Math.pow(TILE_SIZE / 2, 2));
}

class TMC_BR extends TMC_Diagonal {

    cardinalPoints = ["w", "n"];

    getScreenCoordinates(tile, vehicle) {
        const percentage = vehicle.vars.currentTilePosition / this.length;
        return [tile.x_untransformed + percentage * TILE_SIZE / 2, tile.y_untransformed + percentage * TILE_SIZE / 2 - TILE_SIZE / 2];
    }

}

class TMC_TR extends TMC_Diagonal {

    cardinalPoints = ["s", "w"];

    getScreenCoordinates(tile, vehicle) {
        const percentage = vehicle.vars.currentTilePosition / this.length;
        return [tile.x_untransformed + TILE_SIZE / 2 - percentage * TILE_SIZE / 2, tile.y_untransformed - TILE_SIZE + percentage * TILE_SIZE / 2];
    }

}

class TMC_TL extends TMC_Diagonal {

    cardinalPoints = ["e", "s"];

    getScreenCoordinates(tile, vehicle) {
        const percentage = vehicle.vars.currentTilePosition / this.length;
        return [tile.x_untransformed + TILE_SIZE - percentage * TILE_SIZE / 2, tile.y_untransformed - TILE_SIZE / 2 - percentage * TILE_SIZE / 2];
    }

}

class TMC_BL extends TMC_Diagonal {

    cardinalPoints = ["n", "e"];

    getScreenCoordinates(tile, vehicle) {
        const percentage = vehicle.vars.currentTilePosition / this.length;
        return [tile.x_untransformed + TILE_SIZE / 2 + percentage * TILE_SIZE / 2, tile.y_untransformed - percentage * TILE_SIZE / 2];
    }

}

TileMovementController.instances = {
    h: new TMC_WE(),
    v: new TMC_NS(),
    br: new TMC_BR(),
    tr: new TMC_TR(),
    tl: new TMC_TL(),
    bl: new TMC_BL(),
}