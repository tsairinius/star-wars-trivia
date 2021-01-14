import { getRandomWholeNumber } from "./getRandomWholeNumber.js";
import * as utils from "./utilities.js";
import * as CONSTANTS from "../constants.js";

export async function getRandomPerson() {
    const totalNumPeople = await utils.getItemCountIn("https://swapi.py4e.com/api/people/", CONSTANTS.DEFAULT_TOTAL_NUM_PEOPLE);

    let randomId;
    let randomPerson;
    for (let i = 0; i < 10; i ++) {
        randomId = getRandomWholeNumber(1, totalNumPeople);
        randomPerson = await utils.getItemWithId("https://swapi.py4e.com/api/people/", randomId);
        
        if (isValidPerson(randomPerson)) {
            break;
        };
    };
    
    if (!isValidPerson(randomPerson)) {
        throw new Error("Unable to retrieve a valid person after multiple attempts");
    };

    return randomPerson;
}

export function isValidPerson(person) {
    return (
        person && 
        person.name && 
        person.birth_year && 
        person.name !== "unknown" && 
        person.birth_year !== "unknown"
    );
}