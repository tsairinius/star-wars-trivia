export async function getTotalNumPeople() {
    try {
        const response = await fetch("https://swapi.dev/api/people/");
        const json = await response.json();

        return json.count;
    }
    catch (e) {
        return 0;
    }
}

export function getRandomPeopleIds(numPeople, totalNumPeople) {
    let randomId;
    let idArray = [];
    if (numPeople > totalNumPeople) {
        numPeople = totalNumPeople;
    }
    while (idArray.length < numPeople) {
        randomId = Math.floor(Math.random() * totalNumPeople) + 1;
        if (!idArray.includes(randomId)) {
            idArray = [...idArray, randomId];
        }
    }

    return idArray;
}


fetch("https://swapi.dev/api/people/").then(response => response.json()).then(json => console.log(json))

export async function getPeople(idArray) {
    let promise;
    let promises = [];
    idArray.forEach(id => {
        promise = fetch(`https://swapi.dev/api/people/${id}`)
                            .then(response => response.json());
        promises = [...promises, promise];
    });

    const people = await Promise.all(promises);

    console.log(people);

}

// getPeople([1, 2, 3])

// const createBirthyearQuestion = () => {

//     return {
//             question: `What is the birth year of ${randomPerson.name}?`,
//             answer: randomPerson.birth_year
//         }
// }

// module.exports = getTotalNumPeople;

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