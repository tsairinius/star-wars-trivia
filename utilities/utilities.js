import * as birthYear from "../birthYear.js";
import { isPositiveInteger } from "./NumberValidation.js";
import { getRandomWholeNumber } from "./getRandomWholeNumber.js";

export async function getItemCountIn(endpoint, defaultCount) {
    if ((typeof endpoint !== "string") || !isPositiveInteger(defaultCount)) {
        throw new Error("The following args are required: endpoint (string), defaultCount (positive integer)");
    }

    let count = defaultCount;
    try {
        const response = await fetch(endpoint);
        if (response.ok) {
            const fetchedCount = await response.json().then(json => json.count);

            if (!fetchedCount) {
                throw new Error(`Invalid result of ${fetchedCount} retrieved`);
            }
            else {
                count = fetchedCount;
            }
        }
        else {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }
    }
    catch (e) {
        console.error("Unable to access item count from endpoint: ", e)
    }

    return count
}

export async function getItemWithId(endpoint, id) {
    if (typeof endpoint !== "string" || !isPositiveInteger(id)) {
        throw Error("The following args are required: endpoint (string), id (positive integer)");
    }

    let item = null;
    try {
        const response = await fetch(`${endpoint}${id}`);
        if (response.ok) {
            item = await response.json();
        }
        else {
            throw new Error(`HTTP error. Status: ${response.status}`)
        }
    }
    catch (e) {
        console.error(`There was a problem accessing item with ID ${id} from ${endpoint}: `, e)
    }

    return item;
}

export function createRandomQuestion() {
    return birthYear.createBirthYearQuestion();
};

export function randomizeArray(array) {
    if (!Array.isArray(array) || array.length < 1) {
        throw new Error("Argument must be an array with at least one element");
    };

    const arrayCopy = [...array];
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const randomIdx = getRandomWholeNumber(0, i + 1);
        const temp = arrayCopy[randomIdx];
        arrayCopy[randomIdx] = arrayCopy[i];
        arrayCopy[i] = temp;
    }

    return arrayCopy;
};


