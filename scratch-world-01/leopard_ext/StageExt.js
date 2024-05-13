import Stage from "../leopard/Stage/Stage.js";
import { RoadTileExt, TileMovementController } from "./RoadTileExt.js";
import { sprites } from "./index.js";
import { ViewportTransform } from "./ViewportTransform.js";
import { Utils } from "./Utils.js";
import Tree from "../leopard/Tree/Tree.js";
import IsometricHouse from "../leopard/IsometricHouse/IsometricHouse.js";
import IsometricHouse2 from "../leopard/IsometricHouse2/IsometricHouse2.js";
import RailroadCrossingSignalExt from "./RailroadCrossingSignalExt.js";
import { makeVehicleClass } from "./Vehicle.js";
import CityBus from "../leopard/CityBus/CityBus.js";
import Wagon from "../leopard/Wagon/Wagon.js";
import { LocomotiveExt } from "./LocomotiveExt.js";
import { WagonExt } from "./WagonExt.js";

export default class StageExt extends Stage {

    locomotive;

    *whenGreenFlagClicked() {
        yield* super.whenGreenFlagClicked();

        Utils.addToProject(this._project, new RailroadCrossingSignalExt(), -37, 5, { name: "rcs1" });
        Utils.addToProject(this._project, new RailroadCrossingSignalExt(), -100, 54, { name: "rcs2" });

        const IsometricHouseExt = Utils.extend(IsometricHouse);
        Utils.addToProject(this._project, new IsometricHouseExt(), 6, -100);

        const IsometricHouseExt2 = Utils.extend(IsometricHouse2);
        Utils.addToProject(this._project, new IsometricHouseExt2(), -156, 32);

        const TreeExt = Utils.extend(Tree);
        Utils.addToProject(this._project, new TreeExt(), -158, -96);
        Utils.addToProject(this._project, new TreeExt(), -118, -96);
        Utils.addToProject(this._project, new TreeExt(), -78, -96);

        console.log("creating road")

        const firstTile = Utils.addToProject(this._project, new RoadTileExt("h", -100, -50), -100, -50);
        const lastTile = firstTile.add("h", "e").add("h")
            .repeat(3, t => t.add("h"))
            .repeat(3, t => t.add("br").add("tl"))
            .add("br").repeat(5, t => t.add("v"))
            .add("tr").repeat(10, t => t.add("h"))
            .add("tl").repeat(2, t => t.add("v"))
            .add("bl").add("tr").repeat(5, t => t.add("v"))
            .add("bl");
        lastTile.neighbours["e"] = firstTile;
        firstTile.neighbours["w"] = lastTile;

        const firstTile2 = Utils.addToProject(this._project, new RoadTileExt("h", -180, 0), -180, 0);
        const lastTile2 = firstTile2.add("h", "e").repeat(6, t => t.add("h"))
            .add("tr").repeat(6, t => t.add("v"))
            .add("br").repeat(8, t => t.add("h"))
            .add("bl").repeat(6, t => t.add("v"))
            .add("tl");
        lastTile2.neighbours["e"] = firstTile2;
        firstTile2.neighbours["w"] = lastTile2;

        console.log("finished creating road", firstTile, firstTile2);

        // const vehicle2 = sprites.Truck;
        // vehicle2.vars.speed = 4;
        // vehicle2.vars.currentTileEnteredThrough = "w";
        // vehicle2.vars.currentTile = firstTile2;

        // TODO 
        // 1/ *onaddedtoproject currently starts on another "thread". That's why the init done before
        // in RCSExt did not happen yet. Hence this "sleep"
        // 2/ RCSExt / blinking is not OK to do in *onadded; it works only because of 1/. We should do it
        // like in Buttonstartstop: the infinite loop separately
        yield* this.wait(0.1);

        this.locomotive = new LocomotiveExt();
        this.locomotive.size = 10;
        Utils.addToProject(this._project, this.locomotive, 0, 0);
        yield* this.locomotive.putOnRoadTile(firstTile, "w");
        yield* this.locomotive.move(23);

        let wagon;

        this.locomotive.wagon1 = wagon = new WagonExt();
        wagon.size = 10;
        Utils.addToProject(this._project, wagon, 0, 0);
        yield* wagon.putOnRoadTile(firstTile, "w");
        yield* this.locomotive.move(23);

        this.locomotive.wagon2 = wagon = new WagonExt();
        wagon.size = 10;
        Utils.addToProject(this._project, wagon, 0, 0);
        yield* wagon.putOnRoadTile(firstTile, "w");
        yield* this.locomotive.move(23);

        this.locomotive.wagon3 = wagon = new WagonExt();
        wagon.size = 10;
        wagon.lastWagon = true;
        Utils.addToProject(this._project, wagon, 0, 0);
        yield* wagon.putOnRoadTile(firstTile, "w");
    }
}