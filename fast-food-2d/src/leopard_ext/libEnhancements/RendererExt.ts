import { Costume, Renderer } from "leopard";
import Skin from "leopard/dist/renderer/Skin";
import { SpeechBubble } from "leopard/dist/Sprite";
import { VectorSkinExt } from "./VectorSkinExt";
import { BitmapSkinExt } from "./BitmapSkinExt";

export class RendererExt extends Renderer {
    _createSkin(obj: Costume | SpeechBubble): Skin {
        if (obj instanceof Costume) {
            if (obj.isBitmap) {
                return new BitmapSkinExt(this, obj.img);
            } else {
                return new VectorSkinExt(this, obj.img);
            }
        } else {
            return super._createSkin(obj);
        }
    }
}