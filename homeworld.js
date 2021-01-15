import { getRandomWholeNumber } from "./utilities/getRandomWholeNumber.js";
import { createOtherAnswerChoices } from "./utilities/createOtherAnswerChoices.js";
import { PLANETS } from "./planets.js";
import { getPersonAndHomeworld } from "./utilities/getPersonAndHomeworld.js";

export function getHomeworldQuestionAndAnswer(name, homeworld) {
    if ((typeof name === "string") && (typeof homeworld === "string")) {
        return {
            question: `What is ${name}'s homeworld?`,
            answer: homeworld
        }
    }
    else {
        throw new Error(`Name and homeworld arguments must be strings. name: ${name}, homeworld: ${homeworld}`);
    }
}

export function getRandomHomeworld() {
    const numPlanets = PLANETS.length;
    const index = getRandomWholeNumber(0, numPlanets);
    return PLANETS[index];
};

export async function createHomeworldQuestion() {
    try {
        const { person, homeworld } = await getPersonAndHomeworld();

        const questionAndAnswer = getHomeworldQuestionAndAnswer(person, homeworld);
        const otherAnswerChoices = createOtherAnswerChoices(getRandomHomeworld);

        return {
            ...questionAndAnswer,
            otherOptions: [...otherAnswerChoices]
        }
    }
    catch (e) {
        console.error(`Unable to create homeworld question: ${e}`);
        return null;
    }
};