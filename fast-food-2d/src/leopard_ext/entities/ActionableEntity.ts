import { Sound, Trigger } from "leopard";
import { SpriteExt } from "../libEnhancements/SpriteExt";
import { Utils } from "../utils/Utils";
import Character from "./Character";
import MovingEntity from "./MovingEntity";

export class ActionableEntity extends SpriteExt {

    protected characterCloseEnough?: boolean;

    constructor(...args: unknown[]) {
        // @ts-expect-error using args
        super(...args);
        this.checkCharacterCloseEnough();

        // @ts-expect-error maybe issue in API
        this.triggers.push(new Trigger(Trigger.CLICKED, this.whenClicked));

        this.sounds.push(new Sound("error", "./C Trombone.wav"));
    }

    /**
     * Arrow function because callback.
     */
    protected checkCharacterCloseEnough = () => {
        if (MovingEntity.selectedMovingEntity && Math.hypot(MovingEntity.selectedMovingEntity.x - this.x, MovingEntity.selectedMovingEntity.y - this.y) <= 100) {
            if (!this.characterCloseEnough) {
                this.setShadow(20, "blue", true);
            }
            this.characterCloseEnough = true;
        } else {
            if (this.characterCloseEnough || this.characterCloseEnough === undefined) {
                this.setShadow(20, "red", true);
            }
            this.characterCloseEnough = false;
        }
        setTimeout(this.checkCharacterCloseEnough, 300);
    }

    protected getMovingEntityInActionableRange(): MovingEntity | undefined {
        return MovingEntity.selectedMovingEntity;
    }

    protected getCharacterInActionableRange(): Character | undefined {
        const c = this.getMovingEntityInActionableRange();
        if (!(c instanceof Character)) {
            return undefined;
          }
        return c as Character;
    }

    *whenClicked() {
        // this.characterCloseEnough = true;

        Utils.mouseClickProcessedInScratch = true;
        if (!this.characterCloseEnough) {
            yield* this.startSound("error");
            yield* this.sayAndWait("Interaction impossible. A character is not close enough.", 2);
        } else {
            this.showActions();
        }
        yield;
    }

    protected showActions() {
        this.actionsMenu?.show(this.getCharacterInActionableRange()!);
    }
}