import ColoredCircle from "../leopard/ColoredCircle/ColoredCircle.js";
import RailroadCrossingSignal from "../leopard/RailroadCrossingSignal/RailroadCrossingSignal.js";
import { Utils } from "./Utils.js";
import { ViewportTransform } from "./ViewportTransform.js";

const ColoredCircleExt = Utils.extend(ColoredCircle);

export default class RailroadCrossingSignalExt extends Utils.extend(RailroadCrossingSignal) {

    leftCircle;
    rightCircle;

    constructor(...args) {
        super(...args);
        setTimeout(() => {
            this.leftCircle = Utils.addToProject(this._project, new ColoredCircleExt(), 0, 0);
            this.leftCircle.setcolor(120).next();
            this.leftCircle.visible = false;

            this.rightCircle = Utils.addToProject(this._project, new ColoredCircleExt(), 0, 0);
            
            this.goto(this.x, this.y, this.x_untransformed, this.y_untransformed);

            setInterval(() => {
                this.leftCircle.visible = !this.leftCircle.visible;
                this.rightCircle.visible = !this.rightCircle.visible;
            }, 1000);
        });
    }

    goto(x, y, xUntransformed, yUntransformed) {
        super.goto(x, y, xUntransformed, yUntransformed);
        if (xUntransformed === undefined || !this.leftCircle) {
            return;
        }
        ViewportTransform.instance.setCoordinates(this.leftCircle, xUntransformed + 1.79, yUntransformed - 20.29);
        ViewportTransform.instance.setCoordinates(this.rightCircle, xUntransformed + 16.59, yUntransformed - 20.29);
    }
}