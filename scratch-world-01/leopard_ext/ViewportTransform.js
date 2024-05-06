import project, { sprites } from "./index.js";

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

    spriteForSizeFineAdjustment;
    spriteForSizeFineAdjustmentRelativeTo;

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

            if (this.spriteForSizeFineAdjustment && this.spriteForSizeFineAdjustment.x_untransformed !== undefined) {
                let x = this.spriteForSizeFineAdjustment.x_untransformed;
                let y = this.spriteForSizeFineAdjustment.y_untransformed;
                let shouldAdjust = true;
                if (event.key === "a") {
                    x--;
                } else if (event.key === "d") {
                    x++;
                } else if (event.key === "w") {
                    y++;
                } else if (event.key === "s") {
                    y--;
                } else if (event.key === "A") {
                    x -= 0.1;
                } else if (event.key === "D") {
                    x += 0.1;
                } else if (event.key === "W") {
                    y += 0.1;
                } else if (event.key === "S") {
                    y -= 0.1;
                } else {
                    shouldAdjust = false;
                }
                if (shouldAdjust) {
                    this.setCoordinates(this.spriteForSizeFineAdjustment, x, y);
                    if (this.spriteForSizeFineAdjustmentRelativeTo) {
                        console.log("Size fine adjustment (relative)", x - this.spriteForSizeFineAdjustmentRelativeTo.x_untransformed, y - this.spriteForSizeFineAdjustmentRelativeTo.y_untransformed);
                    } else {
                        console.log("Size fine adjustment", x, y);
                    }
                }
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
            localStorage.setItem("famiprogViewportTransformation",
                JSON.stringify({ translateX: this.translateX, translateY: this.translateY, scale: this.scale }));
            this.rerenderAll();
        });
    }

    /**
     * Applies translation, by taking into account the given coords. Applies zoom, by taking
     * into account the `originalSize` (scale/zoom) of the sprite. This info is saved: for not-cloned
     * sprites: in the sprite. For cloned sprites: in the parent.
     */
    setCoordinates(sprite, x, y) {
        const sizeUntransformedHolder = sprite.parent || sprite;
        if (sizeUntransformedHolder.size_initial === undefined) {
            sizeUntransformedHolder.size_initial = sizeUntransformedHolder.size;
        }
        sprite.size = sizeUntransformedHolder.size_initial * this.scale;

        if (!sprite.worldObject) {
            sprite.x_untransformed = x;
            sprite.y_untransformed = y;
        }
        sprite.goto((x + this.translateX) * this.scale, (y + this.translateY) * this.scale, x, y);
        return this;
    }

    rerender(sprite) {
        let x = sprite.worldObject?.x;
        if (x === undefined) {
            x = sprite.x_untransformed;
        }
        let y = sprite.worldObject?.y;
        if (y === undefined) {
            y = sprite.y_untransformed;
        }
        if (x === undefined || y === undefined) {
            return;
        }
        this.setCoordinates(sprite, x, y);
    }

    /**
     * Called after viewport adjusted. It should move/resize all sprites.
     */
    rerenderAll() {
        for (const sprite of project.spritesAndClones) {
            this.rerender(sprite);
        }

        // for (let key in sprites) {
        //     const sprite = sprites[key];
        //     this.rerender(sprite);
        //     for (let clone of sprite.clones) {
        //         this.rerender(clone);
        //     }
        // }
    }

    setSpriteForSizeFineAdjustment(sprite, relativeToSprite) {
        if (this.spriteForSizeFineAdjustment && sprite) {
            throw new Error("Another sprite already set for fine size fine adjustment");
        }

        this.spriteForSizeFineAdjustment = sprite;
        this.spriteForSizeFineAdjustmentRelativeTo = relativeToSprite;
        console.log("Setting sprite for size fine adjustment:", sprite, "relative to:", relativeToSprite);
    }
}