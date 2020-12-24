import * as app from "./app.js";
import * as CONSTANTS from "./constants";

global.fetch = jest.fn();
const consoleErrorMock = jest.spyOn(global.console, "error");

describe("getTotalNumPeople", () => {
    const numPeople = 15;
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Get total number of people in Star Wars API", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({count: numPeople})
        }));
        expect(await app.getTotalNumPeople()).toBe(numPeople);
    });
    
    test("Returns default number of people and prints error if unable to access Star Wars API", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.reject("API error"));
        expect(await app.getTotalNumPeople()).toBe(CONSTANTS.DEFAULT_TOTAL_NUM_PEOPLE);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("When fetch response is not OK, throw error", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false,
            status: 404
        }));

        expect(await app.getTotalNumPeople()).toBe(CONSTANTS.DEFAULT_TOTAL_NUM_PEOPLE);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Throw error if count property from people endpoint is undefined", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({})
        }));

        expect.assertions(1);
        try {
            await app.getTotalNumPeople();
        }
        catch (e) {
            expect(e.message).toBe("Invalid result of undefined retrieved")
        }
    });

    test("Throw error if count property from people endpoint is zero", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({count: 0})
        }));

        expect.assertions(1);
        try {
            await app.getTotalNumPeople();
        }
        catch (e) {
            expect(e.message).toBe("Invalid result of 0 retrieved")
        }
    });
});

describe("getRandomPersonId", () => {
    const totalNumPeople = 10;
    const MathRandomMock = jest.spyOn(global.Math, "random");
    beforeEach(() => {
        MathRandomMock.mockClear();
    });

    test("Minimum value for an ID is 1", () => {
        MathRandomMock.mockReturnValueOnce(0);
        const id = app.getRandomPersonId(totalNumPeople);
        expect(id).toBeGreaterThanOrEqual(1);
    });

    test("Maximum value for an ID is totalNumPeople", () => {
        MathRandomMock.mockReturnValueOnce(0.99);
        const id = app.getRandomPersonId(totalNumPeople);
        expect(id).toBeLessThanOrEqual(totalNumPeople);
    });

    test("Error thrown if totalNumPeople passed in is not a number", () => {
        const invalidArg = "invalidArg";
        expect(() => {
            app.getRandomPersonId(invalidArg)
        }).toThrow(TypeError)
    });
});

describe("getPersonWithId", () => {
    fetch.mockImplementation(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({name: "Luke"})
    }));

    const id = 4;
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Fetches from correct endpoint based on ID passed in", async () => {
        await app.getPersonWithId(id);
        expect(fetch).toHaveBeenCalledWith("https://swapi.dev/api/people/4");
    });

    test("Person object is returned", async () => {
        const person = await app.getPersonWithId(id);
        expect(person.name).toBe("Luke");
    });

    test("If fetch for an ID is rejected, null is returned and error message printed", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.reject("API error"));
        const person = await app.getPersonWithId(id);

        expect(person).toBe(null);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("If fetch response for an ID is not OK, null is returned and error message printed", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false
        }));
        const person = await app.getPersonWithId(id); 

        expect(person).toBe(null);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
});

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
