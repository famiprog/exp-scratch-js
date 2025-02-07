import { getProject } from "../../leopardProjectMain.js";

// cf. doc, GeneratorFunction can only be obtained this way
export const GeneratorFunction = function* () { }.constructor;

export class Utils {

    static mouseClickProcessedInScratch = false;

    // Maybe needed in the future? Although I doubt it.

    // static cloneSprite(sprite) {
    //     if (sprite.parent) {
    //         throw new Error("Cannot clone a clone");
    //     }

    //     sprite.createClone();
    //     const clone = sprite.clones[sprite.clones.length - 1];
    //     clone.visible = true;
    //     clone.onClone?.();
    //     return clone;
    // }

    // I don't know why I did it like this; maybe it's better for the generation of the code?
    // Keeping this for the moment.

    // // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    // static callGeneratorFunctionFromNormalFunction(object: object, functionOrFunctionName: Function | string, ...args: unknown[]) {
    //     if (typeof functionOrFunctionName === "string") {
    //         // @ts-expect-error using reflection
    //         functionOrFunctionName = object[functionOrFunctionName];
    //     }
    //     if (!(functionOrFunctionName instanceof GeneratorFunction)) {
    //         throw new Error("The function is not a GeneratorFunction");
    //     }

    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    //     const generator = (functionOrFunctionName as Function).call(object, ...args);
    //     getProject().runningGenerators.push(generator);
    // }

    /**
     * The callback may return 1/ undefined or 2/ a non-generator.
     * 
     * 1/ maybe the expression contained an ?. inside, and returned undefined
     * 2/ maybe the function called within the callback is a normal function
     */
    static startGenerator(callbackReturningGenerator: () => Generator | unknown) {
        const generator = callbackReturningGenerator();
        // @ts-expect-error use of reflection
        if (typeof generator?.["next"] === "function") {
            getProject().runningGenerators.push(generator as Generator);
        } // else 1/ or 2/
    }
}