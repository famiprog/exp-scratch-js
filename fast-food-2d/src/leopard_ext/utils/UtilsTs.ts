// @ts-expect-error import js in ts
import { Utils as UtilsJs } from "./Utils.js";

export class Utils {
    static extendSpriteClass<T>(spriteClass: T): T {
        return UtilsJs.extend(spriteClass);
    }
}