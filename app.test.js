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

describe("createRandomBirthYear", () => {
    const mathRandomMock = jest.spyOn(global.Math, "random");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Throws error if reference year passed in is not a string", () => {
        expect(() => app.createRandomBirthYear(25)).toThrow("Argument refYear 25 must be a string ending in BBY or ABY. Ex: '30BBY'");
    });

    test("Throws error if reference year is 'unknown'", () => {
        expect(() => app.createRandomBirthYear("unknown")).toThrow("Argument refYear is 'unknown'");
    });

    test("Throws error if reference year does not end in BBY or ABY", () => {
        expect(() => app.createRandomBirthYear("25")).toThrow("Argument refYear 25 must end in BBY or ABY. Ex: '30BBY'");
    });

    test("Returns year within fifty years of reference year", () => {
        mathRandomMock
            .mockReturnValueOnce(0.4)
            .mockReturnValueOnce(0.6);

        expect(app.createRandomBirthYear("5BBY")).toBe("15BBY");
    });

    test("Returns year to one decimal place based on randomly generated numbers", () => {
        mathRandomMock
            .mockReturnValueOnce(0.1357)
            .mockReturnValueOnce(0.6);

        expect(app.createRandomBirthYear("20ABY")).toBe("16.4BBY");
    });

    test("Returns year as integer based on randomly generated numbers", () => {
        mathRandomMock
            .mockReturnValueOnce(0.1357)
            .mockReturnValueOnce(0.1);

        expect(app.createRandomBirthYear("20ABY")).toBe("17BBY");
    });
});
