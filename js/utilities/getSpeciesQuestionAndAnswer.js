export function getSpeciesQuestionAndAnswer(name, species) {
    if ((typeof name === "string") && (typeof species === "string")) {
        return {
            question: `What species is ${name}?`,
            answer: species
        }
    }
    else {
        throw new Error(`Name and species arguments must be strings. name: ${name}, species: ${species}`);
    }
}