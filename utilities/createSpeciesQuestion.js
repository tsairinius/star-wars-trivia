import { getPersonAndProperty } from "./getPersonAndProperty.js";
import { getSpeciesQuestionAndAnswer } from "./getSpeciesQuestionAndAnswer.js";
import { SPECIES } from "../species.js";
import { createOtherAnswerChoices } from "./createOtherAnswerChoices.js";
import { getRandomItem } from "./getRandomItem.js";

export async function createSpeciesQuestion() {
    try {
        const { person, species } = await getPersonAndProperty("species");

        const questionAndAnswer = getSpeciesQuestionAndAnswer(person, species);
        const otherAnswerChoices = createOtherAnswerChoices(() => getRandomItem(SPECIES));

        return {
            ...questionAndAnswer,
            otherOptions: [...otherAnswerChoices]
        }
    }
    catch (e) {
        console.error(`Unable to create species question: ${e}`);
        return null;
    }
};