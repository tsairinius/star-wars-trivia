import { getSpeciesQuestionAndAnswer } from "./getSpeciesQuestionAndAnswer.js";

describe("getSpeciesQuestionAndAnswer", () => {
    const name = "Luke Skywalker";
    const species = "Human";
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    test("Returns object with personalized question and answer", () => {
        const expectedResult = {
            question: "What species is Luke Skywalker?",
            answer: "Human"
        }

        expect(getSpeciesQuestionAndAnswer(name, species)).toEqual(expectedResult);
    }); 

    test("Throws error if name argument is not a string", () => {
        expect(() => getSpeciesQuestionAndAnswer(undefined, species))
            .toThrow(new Error(`Name and species arguments must be strings. name: undefined, species: ${species}`));
    });

    test("Throws error if species argument is not a string", () => {
        expect(() => getSpeciesQuestionAndAnswer(name, undefined))
            .toThrow(new Error(`Name and species arguments must be strings. name: ${name}, species: undefined`));
    });
});