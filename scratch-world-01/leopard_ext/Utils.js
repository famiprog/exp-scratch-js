import {
    Sprite,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";
import { ViewportTransform } from "./ViewportTransform.js";

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

    static extend(spriteClass) {
        return class extends spriteClass {
            constructor(initialConditions = {}, vars = {}) {
                const conditions = {
                    x: 0, y: 0, direction: 90, size: 100,
                    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
                    costumeNumber: 1, visible: true, layerOrder: 1,
                }
                Object.assign(conditions, initialConditions);
                super(conditions, vars);
            }
        }
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {{ name?: string, positionFineAdjustment?: boolean | any } | undefined} options 
     */
    static addToProject(project, sprite, x, y, options) {
        const name = options?.name || crypto.randomUUID();
        project.sprites[name] = sprite;
        sprite._project = project;
        ViewportTransform.instance.setCoordinates(sprite, x, y);
        if (options?.positionFineAdjustment) {
            if (options.positionFineAdjustment === true) {
                ViewportTransform.instance.setSpriteForSizeFineAdjustment(sprite);
            } else {
                ViewportTransform.instance.setSpriteForSizeFineAdjustment(sprite, options.positionFineAdjustment);
            }
        }
        return sprite;
    }
}