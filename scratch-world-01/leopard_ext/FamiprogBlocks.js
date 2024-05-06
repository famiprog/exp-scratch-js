import { GeneratorFunction, Utils } from "./Utils.js";

export class FamiprogBlocks {
    
    static newObject(clazz) {
        return new clazz();
    }
    
    static* call(object, functionName, ...args) {
        const func = object[functionName];
        if (!func) {
            console.error("Error line 1/2: For object:", object, "...");
            throw new Error(`Error line 2/2: ... cannot find function: ${functionName} (object just printed to console / @see above).`)
        }
        const result = func.call(object, ...args);
        if (object[functionName] instanceof GeneratorFunction) {
            return yield* result;
        } else {
            return result;
        }
    }

}

// TODO: temp to use from Scratch w/o import
window.FamiprogBlocks = FamiprogBlocks;