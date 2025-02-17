import { Sound } from "leopard";
import { SpriteExt } from "../libEnhancements/SpriteExt";
import Character from "./Character";

export class ActionableEntity extends SpriteExt {

    protected characterCloseEnough?: boolean;

    constructor(...args: unknown[]) {
        // @ts-expect-error using args
        super(...args);

        this.sounds.push(new Sound("error", "./C Trombone.wav"));

        this.setShadow(20, "blue", true);
    }

    protected getCharacterInActionableRange(): Character | undefined {
        let c: Character | undefined;
        let dist = -1;
        for (const s in this.sprites) {
            let curDist: number;
            if (!(this.sprites[s] instanceof Character) || (curDist = Math.hypot(this.sprites[s].x - this.x, this.sprites[s].y - this.y)) > 100) {
                continue;
            }

            if (!c || curDist < dist) {
                c = this.sprites[s] as Character;
                dist = curDist;
            }
        }
        return c;
    }

    *onRightClick() {
        const c = this.getCharacterInActionableRange();
        if (!c) {
            yield* this.startSound("error");
            yield* this.sayAndWait("Interaction impossible. A character is not close enough.", 2);
        } else {
            this.showActions(c);
        }
    }

    protected showActions(character: Character) {
        this.actionsMenu?.show(character);
    }
}