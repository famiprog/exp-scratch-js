import {
    Sprite,
} from "leopard";
import { ViewportTransform } from "./ViewportTransform.js";

/**
 * @typedef {{ name?: string, positionFineAdjustment?: boolean | any } | undefined} AddToProjectOptions
 */

// cf. doc, GeneratorFunction can only be obtained this way
export const GeneratorFunction = function* () {}.constructor;

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

            /**
             * @type {{ sprite: any, xRelative: number, yRelative: number }[] | undefined}
             */
            children;

            constructor(initialConditions = {}, vars = {}) {
                const conditions = {
                    x: 0, y: 0, direction: 90, size: 100,
                    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
                    costumeNumber: 1, visible: true, layerOrder: 1,
                }
                Object.assign(conditions, initialConditions);
                super(conditions, vars);
            }

            /**
             * @param {number} xRelative
             * @param {number} yRelative
             * @param {AddToProjectOptions} options
             */
            addChildToProject(sprite, xRelative, yRelative, options) {
                if (!this.children) {
                    this.children = [];
                }
                this.children.push({ sprite, xRelative, yRelative });
                return Utils.addToProject(this._project, sprite, this.x_untransformed + xRelative, this.y_untransformed + yRelative, options);
            }

            goto(x, y, xUntransformed, yUntransformed) {
                super.goto(x, y, xUntransformed, yUntransformed);
                if (xUntransformed === undefined || !this.children) {
                    return;
                }
                for (const childInfo of this.children) {
                    ViewportTransform.instance.setCoordinates(childInfo.sprite, xUntransformed + childInfo.xRelative, yUntransformed + childInfo.yRelative);

                }
            }
        }
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {AddToProjectOptions} options 
     */
    static addToProject(project, sprite, x, y, options) {
        const name = options?.name || crypto.randomUUID();
        project.sprites[name] = sprite;
        sprite._project = project;
        if (sprite["onaddedtoproject"]) {
            this.callGeneratorFunctionFromNormalFunction(project, sprite, "onaddedtoproject");
        }
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

    static callGeneratorFunctionFromNormalFunction(project, object, functionName, ...args) {
        const func = object[functionName];
        const result = func.call(object, ...args);
        if (object[functionName] instanceof GeneratorFunction) {
            project.runningGenerators.push(result);
        }
    }

}
