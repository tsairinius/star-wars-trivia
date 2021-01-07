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
            count = await response.json().then(json => json.count);
        }
        else {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }
    }
    catch (e) {
        console.error("Unable to access item count from endpoint: ", e)
    }

    if (!count) {
        throw new Error(`Invalid result of ${count} retrieved`);
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
    let currentIdx = arrayCopy.length - 1;

    while (currentIdx !== 0) {
        const randomIdx = getRandomWholeNumber(0, currentIdx + 1);
        const temp = arrayCopy[randomIdx];
        arrayCopy[randomIdx] = arrayCopy[currentIdx];
        arrayCopy[currentIdx] = temp;
        currentIdx--; 
    }

    return arrayCopy;
};


