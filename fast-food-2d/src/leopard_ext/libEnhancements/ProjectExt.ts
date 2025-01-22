import { Project, Renderer } from "leopard";
import { RendererExt } from "./RendererExt";

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
}