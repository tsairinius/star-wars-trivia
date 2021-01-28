import { createOtherAnswerChoices } from "./utilities/createOtherAnswerChoices.js";
import { PLANETS } from "./planets.js";
import { getPersonAndProperty } from "./utilities/getPersonAndProperty.js";
import { getRandomItem } from "./utilities/getRandomItem.js";

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

export async function createHomeworldQuestion() {
    try {
        const { person, homeworld } = await getPersonAndProperty("homeworld");

        const questionAndAnswer = getHomeworldQuestionAndAnswer(person, homeworld);
        const otherAnswerChoices = createOtherAnswerChoices(questionAndAnswer.answer, () => getRandomItem(PLANETS));

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