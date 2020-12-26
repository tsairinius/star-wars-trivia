import * as app from "./app.js";

describe("getPersonBirthYearQuestion", () => {
    test("Returns object with personalized question and answer", () => {
        const expectedResult = {
            question: "What is the birth year of Plo Koon?",
            answer: "22BBY"
        };

        const person = {
            name: "Plo Koon",
            birth_year: "22BBY"
        };

        expect(app.getPersonBirthYearQuestion(person)).toEqual(expectedResult);
    });

    test("Returns null if person passed in is undefined", () => {
        expect(app.getPersonBirthYearQuestion(undefined)).toBe(null);
    });

    test("Returns null if person passed in is missing name property", () => {
        const person = {
            birth_year: "22BBY"
        };

        expect(app.getPersonBirthYearQuestion(person)).toBe(null);
    });

    test("Returns null if person passed in is missing birth year property", () => {
        const person = {
            name: "Plo Koon"
        };

        expect(app.getPersonBirthYearQuestion(person)).toBe(null);
    });

    test("Returns null if person passed in has unknown name", () => {
        const person = {
            name: "unknown",
            birth_year: "22BBY"
        };

        expect(app.getPersonBirthYearQuestion(person)).toBe(null);
    });

    test("Returns null if person passed in has unknown birth year", () => {
        const person = {
            name: "Plo Koon",
            birth_year: "unknown"
        };

        expect(app.getPersonBirthYearQuestion(person)).toBe(null);
    });
});
