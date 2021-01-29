
import { createSpeciesQuestion } from "./createSpeciesQuestion.js";
import { createHomeworldQuestion } from "../homeworld.js";
import { createBirthYearQuestion } from "../birthYear.js";
import { getRandomItem } from "./getRandomItem.js";

const questionCreators = Object.freeze([
    createSpeciesQuestion,
    createHomeworldQuestion,
    createBirthYearQuestion
]);

export async function createRandomQuestion() {
    return await getRandomItem(questionCreators)();
};