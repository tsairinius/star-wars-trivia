import { getRandomWholeNumber } from "./getRandomWholeNumber.js";

export function getRandomItem(items) {
    if (!Array.isArray(items)) {
        throw new TypeError(`Invalid argument: ${items}. Must be an array`);
    }

    const numItems = items.length;
    const index = getRandomWholeNumber(0, numItems);
    return items[index];
};