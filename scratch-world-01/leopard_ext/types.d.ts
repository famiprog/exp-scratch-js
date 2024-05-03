import { RoadTile } from "./world/RoadTile";

export type CardinalPoint = "w" | "e" | "n" | "s";

export interface IVehicle {
    vars: {
        speed: number;
        currentTile: RoadTile;
        currentTilePosition?: number;
        currentTileEnteredThrough: CardinalPoint;
    },
    goto(x: number, y: number): void;
}
