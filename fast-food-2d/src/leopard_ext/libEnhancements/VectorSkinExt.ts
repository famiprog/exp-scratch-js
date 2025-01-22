import { VectorSkin } from "leopard";
import { ISpriteWithShadow } from "./ISpriteWithShadow";

export class VectorSkinExt extends VectorSkin {

    protected textureUpdatedAtTimestamp?: number;

    protected _doDraw(mipLevel: number, width: number, height: number, sprite?: ISpriteWithShadow): void {
        // @ts-expect-error in reality accepts also undefined
        this._ctx.shadowBlur = sprite?.shadowBlur;
        // @ts-expect-error in reality accepts also undefined
        this._ctx.shadowColor = sprite?.shadowColor;

        super._doDraw(mipLevel, width, height);
    }

    public getTexture(scale: number, sprite?: ISpriteWithShadow): WebGLTexture | null {
        const mipLevel = VectorSkin.mipLevelForScale(scale);
        const now = new Date().getTime();
        if (sprite?.shadowChanged
            && (this.textureUpdatedAtTimestamp === undefined || now - this.textureUpdatedAtTimestamp > 100)) {

            this._mipmaps.delete(mipLevel);
            sprite.shadowChanged = false;
            this.textureUpdatedAtTimestamp = now;
        }
        return super.getTexture(scale, sprite);
    }
}