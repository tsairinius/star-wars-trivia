import { computePercentage } from "./computePercentage.js";

describe("computePercentage", () => {
    const divisor = 100;
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    test("Computes percentage based on divisor and dividend passed in", () => {
        expect(computePercentage(25, divisor)).toBe(25);
    });

    test("Throws error if dividend is not a number", () => {
        expect(() => computePercentage(undefined, divisor)).toThrow(new TypeError("Invalid arguments. Both arguments must be numbers. dividend: undefined, divisor: 100"))
    });

    test("Throws error if divisor is not a number", () => {
        expect(() => computePercentage(100, undefined)).toThrow(new TypeError("Invalid arguments. Both arguments must be numbers. dividend: 100, divisor: undefined"))
    });

    test("If dividend is less than 0, return 0 as percentage", () => {
        expect(computePercentage(-1, divisor)).toBe(0);
    });

    test("Returns 0 if dividend is 0", () => {
        expect(computePercentage(0, divisor)).toBe(0);
    });

    test("Throws error if divisor is equal to 0", () => {
        expect(() => computePercentage(10, 0)).toThrow(new Error("Divisor must be a number greater than 0. divisor: 0"));
    });

    test("Throws error if divisor is less than 0", () => {
        expect(() => computePercentage(10, -1)).toThrow(new Error("Divisor must be a number greater than 0. divisor: -1"));
    });
});