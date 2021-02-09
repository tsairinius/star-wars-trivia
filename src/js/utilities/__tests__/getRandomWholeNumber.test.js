import { getRandomWholeNumber } from "../getRandomWholeNumber.js";

describe("getRandomWholeNumber", () => {
    const min = 3;
    const max = 10;

    let MathRandomMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        MathRandomMock = jest.spyOn(global.Math, "random");
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Minimum value for a number is the arg min", () => {
        MathRandomMock.mockReturnValueOnce(0);
        const id = getRandomWholeNumber(min, max);
        expect(id).toEqual(min);
    });

    test("Maximum value for a number is the value of the arg max minus one", () => {
        MathRandomMock.mockReturnValueOnce(0.99);
        const id = getRandomWholeNumber(min, max);
        expect(id).toEqual(max - 1);
    });

    test("Error thrown if max passed in is not a number", () => {
        const invalidArg = "invalidArg";
        expect(() => getRandomWholeNumber(min, invalidArg))
            .toThrow(new TypeError(`Argument max of ${invalidArg} must be a positive integer`));
    });

    test("Error thrown if min passed in is not a number", () => {
        const invalidArg = "invalidArg";
        expect(() => getRandomWholeNumber(invalidArg, max))
            .toThrow(new TypeError(`Argument min of ${invalidArg} must be a whole number less than max argument`)); 
    });

    test("Error thrown if argument min is undefined", () => {
        expect(() => getRandomWholeNumber(undefined, max))
            .toThrow(new TypeError(`Argument min of undefined must be a whole number less than max argument`)); 
    });

    test("Error throw if argument max is undefined", () => {
        expect(() => getRandomWholeNumber(min, undefined))
            .toThrow(new TypeError(`Argument max of undefined must be a positive integer`)); 
    });

    test("Error thrown if missing an argument", () => {
        expect(() => getRandomWholeNumber(min))
            .toThrow(new TypeError(`Argument max of undefined must be a positive integer`));
    });

    test("Error thrown if argument min is less than zero", () => {
        expect(() => getRandomWholeNumber(-1, max))
            .toThrow(new TypeError(`Argument min of -1 must be a whole number less than max argument`)); 
    });

    test("Error thrown if argument max is less than 1", () => {
        expect(() => getRandomWholeNumber(min, 0))
            .toThrow(new TypeError(`Argument max of 0 must be a positive integer`)); 
    });

    test("Error thrown if argument min is greater than or equal to max", () => {
        expect(() => getRandomWholeNumber(3, 3))
            .toThrow(new TypeError(`Argument min of 3 must be a whole number less than max argument`)); 
    });
});