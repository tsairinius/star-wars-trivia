import { createOtherAnswerChoices } from "./createOtherAnswerChoices.js";

test("Returns array of three unique answer choices", () => {
    const getNumber = jest.fn()
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(3)

    expect(createOtherAnswerChoices(getNumber)).toEqual([5, 4, 3]);
});

test("Throws error if missing argument", () => {
    expect(() => createOtherAnswerChoices()).toThrow(new Error("Must pass in a function"));
});

test("Throws error if argument is not a function", () => {
    expect(() => createOtherAnswerChoices(5)).toThrow(new Error("Must pass in a function"));
});