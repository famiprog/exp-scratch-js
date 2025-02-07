import { Sprite } from "leopard";
import { Utils } from "../utils/Utils";
// @ts-expect-error JS in TS
import { ViewportTransform } from "../utils/ViewportTransform";
import { getProject } from "../../leopardProjectMain";
import { ActionsMenu } from "../entities/ActionsMenu";

interface AddToProjectOptions {
    name?: string,
    positionFineAdjustment?: boolean | unknown
}

export class SpriteExt extends Sprite {

    protected actionsMenu?: ActionsMenu;

    shadowBlur?: number;
    shadowColor?: string;
    shadowBlurBackedUpWhilePulsating?: number;
    shadowPulsatingFrequency?: number;
    shadowChanged?: boolean;

    children: { sprite: SpriteExt, xRelative: number, yRelative: number }[] | undefined;

    constructor(initialConditions = {}, vars = {}) {
        const conditions = {
            x: 0, y: 0, direction: 90, size: 100,
            rotationStyle: Sprite.RotationStyle.ALL_AROUND,
            costumeNumber: 1, visible: true, layerOrder: 1,
        }
        Object.assign(conditions, initialConditions);
        super(conditions, vars);

        const proto = this.constructor.prototype;
        if (proto["instrumented"]) {
            return;
        }
        setTimeout(() => {
            if (!this.actionsMenu || proto["instrumented"]) { // check again is needed; if 2 consecutive constructions => constr 1, constr 2, instr 1, instr 2. during constr 2, instr did not yet happen 
                return;
            }

            for (const f of this.actionsMenu.functionsToShow) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                const original: Function = proto[f];
                proto[f] = function (...args: unknown[]) {
                    Utils.startGenerator(() => this.sayAndWait(f + "() called", 1));
                    return original.apply(this, args);
                }
            }
            proto["instrumented"] = true;
        });
    }

    addToProject(x: number, y: number, options?: AddToProjectOptions): this {
        const project = getProject();
        const name = options?.name || crypto.randomUUID();
        project.sprites[name] = this;
        this._project = project;
        // @ts-expect-error using reflection
        Utils.startGenerator(() => this["onaddedtoproject"]?.());

        ViewportTransform.instance.setCoordinates(this, x, y);
        if (options?.positionFineAdjustment) {
            if (options.positionFineAdjustment === true) {
                ViewportTransform.instance.setSpriteForSizeFineAdjustment(this);
            } else {
                ViewportTransform.instance.setSpriteForSizeFineAdjustment(this, options.positionFineAdjustment);
            }
        }

        Utils.startGenerator(() => this.sayAndWait(this.constructor.name + " added", 1));

        return this;
    }

    dispose() {
        for (const name in this.sprites) {
            if (this.sprites[name] === this) {
                delete this.sprites[name];
            }
        }
    }

    setShadow(blur: number, color: string, pulsatingFrequency?: number | boolean) {
        // this will trigger a recalculation of the texture
        this.shadowChanged = true;
        if (!this.shadowPulsatingFrequency) {
            this.shadowBlur = blur;
        } // else we don't want to insert a "flash"
        this.shadowBlurBackedUpWhilePulsating = blur;
        if (blur === 0) {
            // this will stop the loop, if running
            pulsatingFrequency = 0;
        }
        this.shadowColor = color;
        if (!pulsatingFrequency) {
            // undefined, false or 0
            pulsatingFrequency = undefined;
        } else if (pulsatingFrequency === true) {
            // default value
            pulsatingFrequency = 2;
        }

        const shouldStartLoop = !this.shadowPulsatingFrequency && pulsatingFrequency;
        this.shadowPulsatingFrequency = pulsatingFrequency;
        if (shouldStartLoop) {
            // didn't have loop, and now we need loop
            Utils.startGenerator(() => this.pulsateShadowLoop());
        } // else: 1/ if loop running and changed freq => OK; 2/ if loop running and stopped pulsation => on next iteration the loop will stop; 3/ if no loop and no need for loop => OK
    }

    protected *pulsateShadowLoop() {
        // if 0 => pulsation will stop; the loop will exit
        while (this.shadowPulsatingFrequency) {
            // this will trigger a recalculation of the texture
            this.shadowChanged = true;
            this.shadowBlur = 10 + Math.abs(Math.sin(new Date().getTime() / 1000 * this.shadowPulsatingFrequency)) * this.shadowBlurBackedUpWhilePulsating!;
            yield;
        }
        this.shadowBlur = this.shadowBlurBackedUpWhilePulsating;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addChildToProject(sprite: SpriteExt, xRelative: number, yRelative: number, options?: AddToProjectOptions) {
        if (!this.children) {
            this.children = [];
        }
        this.children.push({ sprite, xRelative, yRelative });
        throw new Error("to fix");
        //// @ts-expect-error TODO fix
        // return Utils.addToProject(sprite, this.x_untransformed + xRelative, this.y_untransformed + yRelative, options);
    }

    // TODO fix
    // goto(x: number, y: number, xUntransformed: number, yUntransformed: number) {
    goto(x: number, y: number, ...otherArgs: number[]) {
        const xUntransformed = otherArgs[0];
        const yUntransformed = otherArgs[1];
        // @ts-expect-error TODO fix
        super.goto(x, y, xUntransformed, yUntransformed);
        if (xUntransformed === undefined || !this.children) {
            return;
        }
        for (const childInfo of this.children) {
            ViewportTransform.instance.setCoordinates(childInfo.sprite, xUntransformed + childInfo.xRelative, yUntransformed + childInfo.yRelative);
        }
    }
}