import Stage from "../leopard/Stage/Stage.js";
import { RoadTile, TileMovementController } from "./world/RoadTile.js";
import { TreeMP, sprites } from "./index.js";
import { ViewportTransform } from "./ViewportTransform.js";
import { Utils } from "./Utils.js";

export default class StageExt extends Stage {
    *whenGreenFlagClicked() {
        yield* super.whenGreenFlagClicked();

        const signal1 = Utils.cloneSprite(sprites.RailroadCrossingSignal);
        ViewportTransform.instance.setCoordinates(signal1, -37, 5);

        const signal2 = Utils.cloneSprite(sprites.RailroadCrossingSignal);
        ViewportTransform.instance.setCoordinates(signal2, -100, 54);

        ViewportTransform.instance.setCoordinates(sprites.IsometricHouse, 6, -100);
        ViewportTransform.instance.setCoordinates(sprites.IsometricHouse2, -156, 32);

        let tree = this._project.sprites[crypto.randomUUID()] = new TreeMP();
        tree._project = this._project;
        ViewportTransform.instance.setCoordinates(tree, -158, -96);

        tree = this._project.sprites[crypto.randomUUID()] = new TreeMP();
        tree._project = this._project;
        ViewportTransform.instance.setCoordinates(tree, -118, -96);

        tree = this._project.sprites[crypto.randomUUID()] = new TreeMP();
        tree._project = this._project;
        ViewportTransform.instance.setCoordinates(tree, -78, -96).setSpriteForSizeFineAdjustment(tree);

        console.log("creating road")

        const firstTile = new RoadTile("h", -100, -50);
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

        const firstTile2 = new RoadTile("h", -180, 0);
        const lastTile2 = firstTile2.add("h", "e").repeat(6, t => t.add("h"))
            .add("tr").repeat(6, t => t.add("v"))
            .add("br").repeat(8, t => t.add("h"))
            .add("bl").repeat(6, t => t.add("v"))
            .add("tl");
        lastTile2.neighbours["e"] = firstTile2;
        firstTile2.neighbours["w"] = lastTile2;

        console.log("finished creating road", firstTile, firstTile2);

        const vehicle = sprites.CityBus;
        vehicle.vars.speed = 10;
        vehicle.vars.currentTileEnteredThrough = "w";
        vehicle.vars.currentTile = firstTile;

        const vehicle2 = sprites.Truck;
        vehicle2.vars.speed = 4;
        vehicle2.vars.currentTileEnteredThrough = "w";
        vehicle2.vars.currentTile = firstTile2;

        while (true) {
            TileMovementController.get(vehicle.vars.currentTile).move(vehicle.vars.currentTile, vehicle, vehicle.vars.speed);
            TileMovementController.get(vehicle2.vars.currentTile).move(vehicle2.vars.currentTile, vehicle2, vehicle2.vars.speed);
            yield;
        }
    }
}