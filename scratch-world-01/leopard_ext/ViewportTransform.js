import { sprites } from "./index.js";

export class ViewportTransform {
    static instance = new ViewportTransform();

    /**
     * @type {number}
     */
    translateX = 0;

    /**
     * @type {number}
     */
    translateY = 0;

    /**
     * @type {number}
     */
    scale = 1;

    constructor() {
        const stored = localStorage.getItem("famiprogViewportTransformation");
        if (stored) {
            Object.assign(this, JSON.parse(stored));
        }
        window.addEventListener("keydown", (event) => {
            if (event.isComposing || event.keyCode === 229) {
                // recommended by the MDN docs
                return;
            }
            if (event.key === "ArrowRight") {
                this.translateX -= 10;
            } else if (event.key === "ArrowLeft") {
                this.translateX += 10;
            } else if (event.key === "ArrowUp") {
                this.translateY -= 10;
            } else if (event.key === "ArrowDown") {
                this.translateY += 10;
            } else if (event.key === "+") {
                this.scale += 0.1;
            } else if (event.key === "-") {
                this.scale -= 0.1;
            } else if (event.key === "0") {
                this.scale = 1;
                this.translateX = this.translateY = 0;
            } else {
                return;
            }
            localStorage.setItem("famiprogViewportTransformation", JSON.stringify(this));
            this.rerenderAll();
        });
    }

    setCoordinates(sprite, x, y) {
        const originalSizeHolder = sprite.parent || sprite;
        if (originalSizeHolder.originalSize === undefined) {
            originalSizeHolder.originalSize = originalSizeHolder.size;
        }
        sprite.size = originalSizeHolder.originalSize * this.scale;
        sprite.goto((x + this.translateX) * this.scale, (y + this.translateY) * this.scale);
    }

    rerender(sprite) {
        if (!sprite.worldObject) {
            return;
        }
        this.setCoordinates(sprite, sprite.worldObject.x, sprite.worldObject.y);
    }

    rerenderAll() {
        for (let key in sprites) {
            const sprite = sprites[key];
            this.rerender(sprite);
            for (let clone of sprite.clones) {
                this.rerender(clone);
            }
        }
    }
}