import * as hw from "./homeworld.js";
import * as randNum from "./utilities/getRandomWholeNumber.js";
import * as choices from "./utilities/createOtherAnswerChoices.js";
import * as pAndHw from "./utilities/getPersonAndHomeworld.js";

describe("createHomeworldQuestion", () => {
    let getPersonAndHomeworldMock, createOtherAnswerChoicesMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        getPersonAndHomeworldMock = jest.spyOn(pAndHw, "getPersonAndHomeworld");
        createOtherAnswerChoicesMock = jest.spyOn(choices, "createOtherAnswerChoices");
    });

    test("Returns an object with a question, answer, and other answer choices", async () => {
        getPersonAndHomeworldMock.mockReturnValueOnce(Promise.resolve({person: "Luke Skywalker", homeworld: "Tatooine"}));
        createOtherAnswerChoicesMock.mockReturnValueOnce(["Naboo", "Dagobah", "Hoth"]);

        const expectedQuestion = {
            question: "What is Luke Skywalker's homeworld?",
            answer: "Tatooine",
            otherOptions: ["Naboo", "Dagobah", "Hoth"]
        };
    
        expect(await hw.createHomeworldQuestion()).toEqual(expectedQuestion);
    });

    test("Prints error message and returns null if any error occurs", async () => {
        const consoleErrorMock = jest.spyOn(console, "error").mockReturnValue();
        const error = "Unable to get a valid person and homeworld";
        getPersonAndHomeworldMock
            .mockImplementationOnce(() => {throw new Error(error)});
        
        expect(await hw.createHomeworldQuestion()).toBeNull();
        expect(consoleErrorMock).toHaveBeenCalledWith(`Unable to create homeworld question: ${new Error(error)}`)
    });
});

describe("getRandomHomeworld", () => {
    let getRandomWholeNumberMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        getRandomWholeNumberMock = jest.spyOn(randNum, "getRandomWholeNumber");
    });

    test("Returns a planet name", () => {
        getRandomWholeNumberMock.mockReturnValueOnce(5);
        expect(hw.getRandomHomeworld()).toBe("Ord Mantell");
    });
});

describe("getHomeworldQuestionAndAnswer", () => {
    const name = "Luke Skywalker";
    const homeworld = "Tatooine";
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    test("Returns object with personalized question and answer", () => {
        const expectedResult = {
            question: "What is Luke Skywalker's homeworld?",
            answer: "Tatooine"
        }

        expect(hw.getHomeworldQuestionAndAnswer(name, homeworld)).toEqual(expectedResult);
    }); 

    test("Throws error if name argument is not a string", () => {
        expect(() => hw.getHomeworldQuestionAndAnswer(undefined, homeworld))
            .toThrow(new Error(`Name and homeworld arguments must be strings. name: undefined, homeworld: ${homeworld}`));
    });

    test("Throws error if homeworld argument is not a string", () => {
        expect(() => hw.getHomeworldQuestionAndAnswer(name, undefined))
            .toThrow(new Error(`Name and homeworld arguments must be strings. name: ${name}, homeworld: undefined`));
    });
});

