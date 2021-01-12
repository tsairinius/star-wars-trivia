import * as utils from "./utilities/utilities.js";
import * as CONSTANTS from "./constants.js";
import { getRandomWholeNumber } from "./utilities/getRandomWholeNumber.js";
import { createOtherAnswerChoices } from "./utilities/createOtherAnswerChoices.js";

export function getPersonBirthYearQuestion(person) {
    if (isValidPerson(person)) {
        return {
            question: `What is the birth year of ${person.name}?`,
            answer: person.birth_year
        }
    }
    else {
        throw new Error(`Invalid person object passed in as argument. Must have valid name and birth_year properties: ${person ? JSON.stringify(person) : person}`);
    }
};

export function createRandomBirthYear(refYear = "0BBY") {
    if (typeof refYear !== "string") {
        throw new Error(`Argument refYear ${refYear} must be a string ending in BBY or ABY. Ex: '30BBY'`);
    }

    if (refYear === "unknown") {
        throw new Error("Argument refYear is 'unknown'");
    }

    const era  = refYear.slice(-3);
    if (era !== "BBY" && era !== "ABY") {
        throw new Error(`Argument refYear ${refYear} must end in BBY or ABY. Ex: '30BBY'`);
    }

    let refYearValue = Number(refYear.slice(0, -3));
    refYearValue = era === "BBY" ? -refYearValue : refYearValue;

    const min = refYearValue - 50;
    const max = refYearValue + 50;

    let year = Math.random()*(max - min) + min;
    const shouldFloor = Math.random() < 0.5;
    year = shouldFloor ? Math.floor(year) : year.toFixed(1);

    const result = year < 0 ? `${-year}BBY` : `${year}ABY`;

    return result;
};

export async function createBirthYearQuestion() {
    try {
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

        const result = getPersonBirthYearQuestion(randomPerson);
        const otherOptions = createOtherAnswerChoices(() => createRandomBirthYear(result.answer));

        return {
            ...result,
            otherOptions
        };
    }
    catch (e) {
        console.error(e);
        return null;
    }
};

function isValidPerson(person) {
    return (
        person && 
        person.name && 
        person.birth_year && 
        person.name !== "unknown" && 
        person.birth_year !== "unknown"
    );
}