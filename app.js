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


// fetch("https://swapi.dev/api/planets/").then(response => response.json()).then(json => console.log(json))

// (async () => console.log(await getTotalNumPeople().catch(e => console.log("Problem: ", e))))()

// (async () => console.log(await getPersonWithId(0)))()
