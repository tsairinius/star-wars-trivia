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

export function getRandomPeopleIndices(numPeople, totalNumPeople) {
    let randomIdx;
    let indices = [];
    if (numPeople > totalNumPeople) {
        numPeople = totalNumPeople;
    }
    while (indices.length < numPeople) {
        randomIdx = Math.floor(Math.random() * totalNumPeople) + 1;
        if (!indices.includes(randomIdx)) {
            indices = [...indices, randomIdx];
        }
    }

    return indices;
}

// const getRandomPeople = async (numPeople, totalNumPeople) => {
//     let randomPerson;
//     let randomPeople = [];
//     await indices.forEach(async idx => {
//         randomPerson = await fetch(`https://swapi.dev/api/people/${idx}`).then(response => response.json());
//         console.log("random person: ", randomPerson)
//         randomPeople = [...randomPeople, randomPerson]
//     })

//     console.log("the people", randomPeople)

//     return randomPeople;
// }

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