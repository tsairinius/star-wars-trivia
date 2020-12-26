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

export function getRandomId(max) {
    if (!isPositiveInteger(max)) {
        throw new TypeError(`Argument max of (${max}) must be a positive integer greater than zero`);
    }

    const randomNum = Math.random();
    return Math.floor(randomNum * max) + 1;
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

function isPositiveInteger(number) {
    return Number.isInteger(number) && number > 0;
}
