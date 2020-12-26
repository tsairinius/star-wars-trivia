import * as app from "./app.js";
import * as CONSTANTS from "./constants";

global.fetch = jest.fn();
const consoleErrorMock = jest.spyOn(global.console, "error");

describe("getItemCountIn", () => {
    const numPeople = 15;
    const defaultNumPeople = 10;

    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockReset();
    });

    test("Throws error if endpoint argument is not a string", async () => {
        const invalidArg = [];
        expect.assertions(1);
        try {
            await app.getItemCountIn(invalidArg, defaultNumPeople);
        }
        catch(e) {
            expect(e.message)
            .toBe("The following args are required: endpoint (string), defaultCount (positive integer)");
        }
    });

    test("Throws error if default count argument is not a number greater than 0", async () => {
        const invalidArg = 0;
        expect.assertions(1);
        try {
            await app.getItemCountIn("https://swapi.dev/api/people/", invalidArg);
        }
        catch(e) {
            expect(e.message)
            .toBe("The following args are required: endpoint (string), defaultCount (positive integer)");
        }
    }); 

    test("Get item count from a particular endpoint", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({count: numPeople})
        }));
        expect(await app.getItemCountIn("https://swapi.dev/api/people/", defaultNumPeople))
            .toBe(numPeople);
    });
    
    test("Returns default item count and prints error if unable to access Star Wars API", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.reject("API error"));
        expect(await app.getItemCountIn("https://swapi.dev/api/people/", defaultNumPeople))
            .toBe(defaultNumPeople);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("When fetch response is not OK, return default count and print error", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false,
            status: 404
        }));

        expect(await app.getItemCountIn("https://swapi.dev/api/people/", defaultNumPeople))
            .toBe(defaultNumPeople);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Throw error if count property from endpoint is undefined", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({})
        }));

        expect.assertions(1);
        try {
            await app.getItemCountIn("https://swapi.dev/api/people/", defaultNumPeople);
        }
        catch (e) {
            expect(e.message).toBe("Invalid result of undefined retrieved")
        }
    });

    test("Throw error if count property from endpoint is zero", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({count: 0})
        }));

        expect.assertions(1);
        try {
            await app.getItemCountIn("https://swapi.dev/api/people/", defaultNumPeople);
        }
        catch (e) {
            expect(e.message).toBe("Invalid result of 0 retrieved")
        }
    });
});

describe("getRandomId", () => {
    const max = 10;
    const MathRandomMock = jest.spyOn(global.Math, "random");
    beforeEach(() => {
        MathRandomMock.mockClear();
    });

    test("Minimum value for an ID is 1", () => {
        MathRandomMock.mockReturnValueOnce(0);
        const id = app.getRandomId(max);
        expect(id).toBeGreaterThanOrEqual(1);
    });

    test("Maximum value for an ID is the value of the arg max", () => {
        MathRandomMock.mockReturnValueOnce(0.99);
        const id = app.getRandomId(max);
        expect(id).toBeLessThanOrEqual(max);
    });

    test("Error thrown if max passed in is not a number", () => {
        const invalidArg = "invalidArg";
        expect(() => {
            app.getRandomId(invalidArg)
        }).toThrow(TypeError)
    });
});

describe("getItemWithId", () => {
    const id = 4;
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockReset();
    });

    test("Throws error if argument endpoint is not a string", async () => {
        const invalidArg = 4;
        expect.assertions(1);
        try {
            await app.getItemWithId(invalidArg, id);
        }
        catch (e) {
            expect(e.message)
                .toBe("The following args are required: endpoint (string), id (positive integer)");
        }
    });

    test("Throws error if argument id is not a positive integer", async () => {
        const invalidArg = 0;
        expect.assertions(1);
        try {
            await app.getItemWithId("https://swapi.dev/api/people/", invalidArg);
        }
        catch (e) {
            expect(e.message)
                .toBe("The following args are required: endpoint (string), id (positive integer)");
        }
    });

    test("Fetches from correct endpoint based on ID passed in", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({name: "Luke"})
        }));
        await app.getItemWithId("https://swapi.dev/api/people/", id);
        expect(fetch).toHaveBeenCalledWith("https://swapi.dev/api/people/4");
    });

    test("Object is returned", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({name: "Luke"})
        }));

        const person = await app.getItemWithId("https://swapi.dev/api/people/", id);
        expect(person.name).toBe("Luke");
    });

    test("If fetch for an ID is rejected, null is returned and error message printed", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.reject("API error"));
        const person = await app.getItemWithId("https://swapi.dev/api/people/", id);

        expect(person).toBe(null);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("If fetch response for an ID is not OK, null is returned and error message printed", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false
        }));
        const person = await app.getItemWithId("https://swapi.dev/api/people/", id); 

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
