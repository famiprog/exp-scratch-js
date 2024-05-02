import CityBus from "../leopard/CityBus/CityBus.js";

const xMax = 100;
const yMax = 100

let fps = 0;

// setInterval(() => {
//     console.log("FPS", fps);
//     fps = 0;
// }, 1000);

export default class CityBusExt extends CityBus {

    *whenGreenFlagClicked() {
        this.vars.speed = 7;
        this.vars.direction = "e";
        this.x = -xMax;
        this.y = -yMax;
        while (true) {
            fps++;
            switch (this.vars.direction) {
                case "e":
                    this.x += this.toNumber(this.vars.speed);
                    if (this.x > xMax) {
                        this.x = xMax;
                        this.vars.direction = "n";
                    }
                    break;
                case "w":
                    this.x -= this.toNumber(this.vars.speed);
                    if (this.x < -xMax) {
                        this.x = -xMax;
                        this.vars.direction = "s";
                    }
                    break;
                case "n":
                    this.y += this.toNumber(this.vars.speed);
                    if (this.y > yMax) {
                        this.y = yMax;
                        this.vars.direction = "w";
                    }
                    break;
                case "s":
                    this.y -= this.toNumber(this.vars.speed);
                    if (this.y < -yMax) {
                        this.y = -yMax;
                        this.vars.direction = "e";
                    }
                    break;
            }
            yield;
        }
    }
}