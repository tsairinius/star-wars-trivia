import { getRandomWholeNumber } from "./getRandomWholeNumber.js";
import * as utils from "./utilities.js";
import * as CONSTANTS from "../constants.js";

export async function getRandomPersonWithProps(props) {
    const totalNumPeople = await utils.getItemCountIn("https://swapi.py4e.com/api/people/", CONSTANTS.DEFAULT_TOTAL_NUM_PEOPLE);

    let randomId;
    let randomPerson;
    for (let i = 0; i < 10; i ++) {
        randomId = getRandomWholeNumber(1, totalNumPeople);
        randomPerson = await utils.getItemWithId("https://swapi.py4e.com/api/people/", randomId);
        
        if (validateProperties(randomPerson, props)) {
            break;
        };
    };
    
    if (!validateProperties(randomPerson, props)) {
        throw new Error("Unable to retrieve a valid person after multiple attempts");
    };

    return randomPerson;
}

export function validateProperties(person, props = []) {
    if (!Array.isArray(props)) {
        throw new TypeError("First argument should be a person object and the second an array of properties (eg: 'name', 'birth_year') in string representation");
    }

    let isValid = true;
    if (!person) {
        isValid = false;
    }
    else {
        isValid = !props.some(prop => !person[prop] || person[prop] === "unknown");
    }

    return isValid;
}