import { getRandomWholeNumber } from "./getRandomWholeNumber.js";
import * as utils from "./utilities.js";
import * as CONSTANTS from "../constants.js";
import { validateProperties } from "./validateProperties.js";

export async function getRandomPersonWithProps(props) {
    const totalNumPeople = await utils.getItemCountIn("https://swapi.py4e.com/api/people/", CONSTANTS.DEFAULT_TOTAL_NUM_PEOPLE);

    let randomId;
    let randomPerson;
    for (let i = 0; i < 10; i ++) {
        randomId = getRandomWholeNumber(1, totalNumPeople);
        randomPerson = await utils.fetchItem(`https://swapi.py4e.com/api/people/${randomId}`);
        
        if (validateProperties(randomPerson, props)) {
            break;
        };
    };
    
    if (!validateProperties(randomPerson, props)) {
        throw new Error("Unable to retrieve a valid person after multiple attempts");
    };

    return randomPerson;
}