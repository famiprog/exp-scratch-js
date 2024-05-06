export class Utils {
    static cloneSprite(sprite) {
        if (sprite.parent) {
            throw new Error("Cannot clone a clone");
        }
       
        sprite.createClone();
        const clone = sprite.clones[sprite.clones.length - 1];
        clone.visible = true;
        clone.onClone?.();
        return clone;
    }
}