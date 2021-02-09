import { isPercentage } from "../isPercentage.js";

describe("isPercentage", () => {
    test("Returns true if argument is a number between 0 and 100", () => {
        expect(isPercentage(20)).toBeTruthy();
    });
    
    test("Returns true if argument is 0", () => {
        expect(isPercentage(0)).toBeTruthy();
    });

    test("Returns true if argument is 100", () => {
        expect(isPercentage(100)).toBeTruthy();
    });

    test("Returns false if argument is undefined", () => {
        expect(isPercentage()).toBeFalsy();
    });

    test("Returns false if argument is not a number", () => {
        expect(isPercentage("badArg")).toBeFalsy();
    });

    test("Returns false if argument is a number greater than 100", () => {
        expect(isPercentage(101)).toBeFalsy();
    });

    test("Returns false if argument is less than 0", () => {
        expect(isPercentage(-0.1)).toBeFalsy();
    });
});