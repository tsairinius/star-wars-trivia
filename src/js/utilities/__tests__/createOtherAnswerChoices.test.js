import { createOtherAnswerChoices } from "../createOtherAnswerChoices.js";

describe("createOtherAnswerChoices", () => {
    const correctAnswer = 10;
    test("Returns array of three unique answer choices", () => {
        const getNumber = jest.fn()
            .mockReturnValueOnce(5)
            .mockReturnValueOnce(4)
            .mockReturnValueOnce(4)
            .mockReturnValueOnce(3)
    
        expect(createOtherAnswerChoices(correctAnswer, getNumber)).toEqual([5, 4, 3]);
    });
    
    test("Tries to retrieve another answer choice if it receives one that is the same as the correct answer", () => {
        const getNumber = jest.fn()
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(correctAnswer)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(3)
    
        expect(createOtherAnswerChoices(correctAnswer, getNumber)).toEqual([5, 4, 3]);
    });
    
    test("Throws error if missing argument", () => {
        expect(() => createOtherAnswerChoices(correctAnswer)).toThrow(new Error("Must pass in two arguments: the correct answer to compare against and a function for creating answer choices"));
    });
    
    test("Throws error if second argument is not a function", () => {
        expect(() => createOtherAnswerChoices(correctAnswer, 5)).toThrow(new Error("Must pass in two arguments: the correct answer to compare against and a function for creating answer choices"));
    });
});