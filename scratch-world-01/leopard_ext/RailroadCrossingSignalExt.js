import ColoredCircle from "../leopard/ColoredCircle/ColoredCircle.js";
import RailroadCrossingSignal from "../leopard/RailroadCrossingSignal/RailroadCrossingSignal.js";
import { FamiprogBlocks } from "./FamiprogBlocks.js";
import { Utils } from "./Utils.js";

const ColoredCircleExt = Utils.extend(ColoredCircle);
// TODO: temp to use from Scratch w/o import
window.ColoredCircleExt = ColoredCircleExt;

export default class RailroadCrossingSignalExt extends Utils.extend(RailroadCrossingSignal) {

    leftCircle;
    rightCircle;

    // Initial version, w/o having scratch in mind. 
    *onaddedtoproject1() {
        this.leftCircle = this.addChildToProject(new ColoredCircleExt(), 1.79, -20.29);
        this.rightCircle = this.addChildToProject(new ColoredCircleExt(), 16.59, -20.29);
        yield* this.leftCircle.setcolor(120);
        this.leftCircle.visible = false;

        while (true) {
            yield* this.wait(1);
            this.leftCircle.visible = !this.leftCircle.visible;
            this.rightCircle.visible = !this.rightCircle.visible;
        }
    }
    
    // Second version, w/ scratch / the new blocks in mind. 
    // Third version is in scratch. Is a copy/paste of the lines below.
    *onaddedtoproject2() {
        this.leftCircle = yield* FamiprogBlocks.call(this, "addChildToProject", FamiprogBlocks.newObject(ColoredCircleExt), 1.79, -20.29);
        this.rightCircle = yield* FamiprogBlocks.call(this, "addChildToProject", FamiprogBlocks.newObject(ColoredCircleExt), 16.59, -20.29);
        yield* FamiprogBlocks.call(this.leftCircle, "setcolor", 120);
        this.leftCircle.visible = false;

        while (true) {
            yield* this.wait(1);
            this.leftCircle.visible = !this.leftCircle.visible;
            this.rightCircle.visible = !this.rightCircle.visible;
        }
    }

}