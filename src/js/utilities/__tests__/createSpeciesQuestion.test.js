import { createSpeciesQuestion } from "../createSpeciesQuestion.js";
import * as p from "../getPersonAndProperty.js";
import * as choices from "../createOtherAnswerChoices.js";

describe("createSpeciesQuestion", () => {
    let getPersonAndPropertyMock, createOtherAnswerChoicesMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        getPersonAndPropertyMock = jest.spyOn(p, "getPersonAndProperty");
        createOtherAnswerChoicesMock = jest.spyOn(choices, "createOtherAnswerChoices");
    });

    test("Returns an object with a question, answer, and other answer choices", async () => {
        getPersonAndPropertyMock.mockReturnValueOnce(Promise.resolve({person: "Luke Skywalker", species: "Human"}));
        createOtherAnswerChoicesMock.mockReturnValueOnce(["Pau'an", "Kaminoan", "Gungan"]);

        const expectedQuestion = {
            question: "What species is Luke Skywalker?",
            answer: "Human",
            otherOptions: ["Pau'an", "Kaminoan", "Gungan"]
        };
    
        expect(await createSpeciesQuestion()).toEqual(expectedQuestion);
    });

    test("Prints error message and returns null if any error occurs", async () => {
        const consoleErrorMock = jest.spyOn(console, "error").mockReturnValue();
        const error = "Unable to get a valid person and species";
        getPersonAndPropertyMock
            .mockImplementationOnce(() => {throw new Error(error)});
        
        expect(await createSpeciesQuestion()).toBeNull();
        expect(consoleErrorMock).toHaveBeenCalledWith(`Unable to create species question: ${new Error(error)}`)
    });
});