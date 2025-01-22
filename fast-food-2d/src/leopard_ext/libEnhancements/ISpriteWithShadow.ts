import { Sprite } from "leopard";

export interface ISpriteWithShadow extends Sprite {
    shadowBlur?: number;
    shadowColor?: string;
    shadowChanged?: boolean;
}