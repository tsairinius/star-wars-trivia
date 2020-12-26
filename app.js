import * as CONSTANTS from "./constants.js";

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

export function getPersonBirthYearQuestion(person) {
    let result = null;
    const isArgumentValid = (
        person && 
        person.name && 
        person.birth_year && 
        person.name !== "unknown" && 
        person.birth_year !== "unknown"
    );

    if (isArgumentValid) {
        result = {
            question: `What is the birth year of ${person.name}?`,
            answer: person.birth_year
        }
    }

    return result;
};

function isPositiveInteger(number) {
    return Number.isInteger(number) && number > 0;
}


// fetch("https://swapi.dev/api/planets/").then(response => response.json()).then(json => console.log(json))

// (async () => console.log(await getTotalNumPeople().catch(e => console.log("Problem: ", e))))()

// (async () => console.log(await getPersonWithId(0)))()

/*
Questions:
-From the planets api: 
    What planet is associated with this kind of terrain? 
    What film(s) did this planet appear in? 
    Which of the following planets is not from the Star Wars universe? 
-From people api:
    When is yoda's birthday? 
    What planet is yoda from? 
    Which of the following characters is not a part of the Star Wars universe? 
    What films does yoga appear in? Or does not appear in? 
-From films api:
    What is the title of episode 4?
    Who directed episode 5?
    Who produced episode 5? 
    What date was episode 5 released on? 
    How does the opening crawl of episode 5 begin? 
    The opening crawl of episode ___ begins with "blah blah blah"
-From species api:
    This planet is homeworld to this species
    What is the native language of this species? 
-From vehicles api:
    Which of the following is not a vehicle from the star wars universe? 
    Who is the manufacturer of this vehicle? 
    What films does this vehicle appear in? 
-From starship api:
    What films does this starship appear in? 
    Who is the manufacturer of this starship? 
    What starship has character X driven (or not driven)? 


*/