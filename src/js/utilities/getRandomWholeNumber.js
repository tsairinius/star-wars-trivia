import { isPositiveInteger, isWholeNumber } from "./NumberValidation.js";

export function getRandomWholeNumber(min, max) {
    if (!isPositiveInteger(max)) {
        throw new TypeError(`Argument max of ${max} must be a positive integer`);
    }

    if (!isWholeNumber(min) || min >= max) {
        throw new TypeError(`Argument min of ${min} must be a whole number less than max argument`);
    }

    const randomNum = Math.random();
    return Math.floor(randomNum * (max - min)) + min;
}