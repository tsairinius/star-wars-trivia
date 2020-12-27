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

// createRandomBirthYearAround("1000BBY")


// fetch("https://swapi.dev/api/people/").then(response => response.json()).then(json => console.log(json))

// (async () => console.log(await getTotalNumPeople().catch(e => console.log("Problem: ", e))))()

// (async () => console.log(await getPersonWithId(0)))()


// max birthyear: 35ABY. min birthyear: 1000BBY