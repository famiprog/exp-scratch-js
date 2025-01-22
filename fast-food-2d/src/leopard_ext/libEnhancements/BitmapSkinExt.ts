import { BitmapSkin } from "leopard";
import { ISpriteWithShadow } from "./ISpriteWithShadow";

export class BitmapSkinExt extends BitmapSkin {
    
    protected textureUpdatedAtTimestamp?: number;
    
    protected _makeTexture(
        image: HTMLImageElement,
        filtering:
            | WebGLRenderingContext["NEAREST"]
            | WebGLRenderingContext["LINEAR"],
        sprite?: ISpriteWithShadow
    ): WebGLTexture {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        const ctx = canvas.getContext("2d");
        
        // @ts-expect-error in reality accepts also undefined
        ctx!.shadowBlur = sprite?.shadowBlur;
        // @ts-expect-error in reality accepts also undefined
        ctx!.shadowColor = sprite?.shadowColor;
        ctx!.drawImage(image, 0, 0);
        return super._makeTexture(canvas, filtering);
    }

    getTexture(scale: number, sprite?: ISpriteWithShadow): WebGLTexture | null {
        const now = new Date().getTime();
        if (sprite?.shadowChanged
            && (this.textureUpdatedAtTimestamp === undefined || now - this.textureUpdatedAtTimestamp > 100)) {

            this._texture = null;
            sprite.shadowChanged = false;
            this.textureUpdatedAtTimestamp = now;
        }
        return super.getTexture(scale, sprite);
    }

}