import { Project, Renderer } from "leopard";
import { RendererExt } from "./RendererExt";
import { Utils } from "../utils/Utils";

export class ProjectExt extends Project {

    runningGenerators: Generator[] = [];

    protected createRenderer(): Renderer {
        return new RendererExt(this, null);
    }

    protected step() {
        super.step();
        let i = 0;
        while (i < this.runningGenerators.length) {
            const generator = this.runningGenerators[i];
            const done = generator.next().done;
            if (done) {
                this.runningGenerators.splice(i, 1);
            } else {
                i++;
            }
        }
    }

    public attach(renderTarget: string | HTMLElement): void {
        super.attach(renderTarget);
        this.renderer.stage.addEventListener("contextmenu", event => {
            event.preventDefault()
            const clickedSprite = this.renderer.pick(this.spritesAndClones, {
                x: this.input.mouse.x,
                y: this.input.mouse.y,
            });
            console.log("cli", clickedSprite)
            // @ts-expect-error using reflection
            Utils.startGenerator(() => clickedSprite["onRightClick"]?.());
        });
    }
}