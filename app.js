import * as utils from "./utilities.js";
import * as CONSTANTS from "./constants.js";

export function getPersonBirthYearQuestion(person) {
    const isArgumentValid = (
        person && 
        person.name && 
        person.birth_year && 
        person.name !== "unknown" && 
        person.birth_year !== "unknown"
    );

    if (isArgumentValid) {
        return {
            question: `What is the birth year of ${person.name}?`,
            answer: person.birth_year
        }
    }
    else {
        throw Error(`Invalid person object passed in as argument. Must have valid name and birth_year properties: ${person ? JSON.stringify(person) : person}`);
    }
};

export function createRandomBirthYear(refYear = "0BBY") {
    if (typeof refYear !== "string") {
        throw Error(`Argument refYear ${refYear} must be a string ending in BBY or ABY. Ex: '30BBY'`);
    }

    if (refYear === "unknown") {
        throw Error("Argument refYear is 'unknown'");
    }

    const era  = refYear.slice(-3);
    if (era !== "BBY" && era !== "ABY") {
        throw Error(`Argument refYear ${refYear} must end in BBY or ABY. Ex: '30BBY'`);
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
        const totalNumPeople = await utils.getItemCountIn("https://swapi.dev/api/people/", CONSTANTS.DEFAULT_TOTAL_NUM_PEOPLE);
        const randomId = utils.getRandomId(totalNumPeople);
        const randomPerson = await utils.getItemWithId("https://swapi.dev/api/people/", randomId);
        const result = getPersonBirthYearQuestion(randomPerson);
        const otherOptions = [
            createRandomBirthYear(result.answer), 
            createRandomBirthYear(result.answer), 
            createRandomBirthYear(result.answer)
        ];

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

// (async () => console.log(await createBirthYearQuestion()))()
