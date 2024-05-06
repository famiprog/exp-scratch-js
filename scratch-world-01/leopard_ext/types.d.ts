import { RoadTileExt } from "./world/RoadTileExt";

export type CardinalPoint = "w" | "e" | "n" | "s";

export interface IVehicle {
    vars: {
        speed: number;
        currentTile: RoadTileExt;
        currentTilePosition?: number;
        currentTileEnteredThrough: CardinalPoint;
    },
    goto(x: number, y: number): void;
}
