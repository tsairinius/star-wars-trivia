import { createRandomQuestion } from "../createRandomQuestion.js";
import * as random from "../getRandomItem.js";
import { question } from "../../fakeQuestions.js";

describe("createRandomQuestion", () => {
    test("Calls a random question creator", async () => {
        const createQuestion = jest.fn(() => Promise.resolve(question));
        const getRandomItemMock = jest.spyOn(random, "getRandomItem").mockReturnValue(createQuestion);

        expect(await createRandomQuestion()).toEqual(question);
    });
});