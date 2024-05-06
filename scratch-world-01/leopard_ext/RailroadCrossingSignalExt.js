import RailroadCrossingSignal from "../leopard/RailroadCrossingSignal/RailroadCrossingSignal.js";
import { ViewportTransform } from "./ViewportTransform.js";
import { ColoredCircledMP, sprites } from "./index.js";

export default class RailroadCrossingSignalExt extends RailroadCrossingSignal {
    
    leftCircle;
    rightCircle;
    
    onClone() {
        // this.leftCircle = Utils.cloneSprite(sprites.ColoredCircle);
        this.leftCircle = this._project.sprites[crypto.randomUUID()] = new ColoredCircledMP();
        this.leftCircle._project = this._project;
        this.leftCircle.setcolor(120).next();

        // this.rightCircle = Utils.cloneSprite(sprites.ColoredCircle);
        this.rightCircle = this._project.sprites[crypto.randomUUID()] = new ColoredCircledMP();
        this.rightCircle._project = this._project;
        this.rightCircle.visible = false;
        setInterval(() => {
            this.leftCircle.visible = !this.leftCircle.visible;
            this.rightCircle.visible = !this.rightCircle.visible;
        }, 1000);
    }

    goto(x, y, xUntransformed, yUntransformed) {
        super.goto(x, y, xUntransformed, yUntransformed);
        if (xUntransformed === undefined) {
            return;
        }
        ViewportTransform.instance.setCoordinates(this.leftCircle, xUntransformed + 1.79, yUntransformed - 20.29);
        ViewportTransform.instance.setCoordinates(this.rightCircle, xUntransformed + 16.59, yUntransformed - 20.29);
    }
}