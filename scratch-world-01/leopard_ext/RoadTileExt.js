import RoadTile from "../leopard/RoadTile/RoadTile.js"

export default class RoadTileExt extends RoadTile {
    
    static instance;
    
    constructor(initialConditions, vars) {
        super(initialConditions, vars);
        if (!RoadTileExt.instance) {
            RoadTileExt.instance = this;
        }
        setTimeout(() => {
            for (let i = 1; i < 10; i++) {
                RoadTileExt.create("we", i * 16, 0);
                RoadTileExt.create("we", i * 16, 10 * 16);
                RoadTileExt.create("ns", 0, i * 16);
                RoadTileExt.create("ns", 10 * 16, i * 16);
            }
            // RoadTileExt.create("ns", 40, 40);
        });
    }

    /**
     * @typedef {"we" | "ns"} Direction
     */

    /**
     * @param {Direction} direction
     * @param {number} x 
     * @param {number} y 
     */
    static create(direction, x, y) {
        RoadTileExt.instance.createClone();
        const clone = RoadTileExt.instance.clones[RoadTileExt.instance.clones.length - 1];
        clone.costume = direction;
        clone.goto(x, y);
        clone.visible = true;
    }
}