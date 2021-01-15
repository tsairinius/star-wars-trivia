import { getRandomPersonWithProps, validateProperties } from "./person.js";
import * as utils from "./utilities.js";
const properties = Object.freeze(["name", "birth_year"]);

describe("getRandomPersonWithProps", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        utils.getItemCountIn = jest.fn(() => Promise.resolve(10))
        utils.fetchItem = jest.fn(() => Promise.resolve({
            name: "Luke Skywalker",
            birth_year: "19BBY"
        }));
        
        consoleErrorMock = jest.spyOn(console, "error").mockReturnValue();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Returns person object", async () => {
        const person = await getRandomPersonWithProps(properties);
        expect(person.name).toBe("Luke Skywalker");
        expect(person.birth_year).toBe("19BBY");
    });

    test("Makes another attempt to fetch a valid person if previous person's birth year is invalid", async () => {
        utils.fetchItem.mockImplementationOnce(() => Promise.resolve({
            name: "Luke Skywalker",
            birth_year: "unknown"
        }));

        const person = await getRandomPersonWithProps(properties);
        expect(person.name).toBe("Luke Skywalker");
        expect(person.birth_year).toBe("19BBY");
    });

    test("Makes another attempt to fetch a valid person if previous person's name is invalid", async () => {
        utils.fetchItem.mockImplementationOnce(() => Promise.resolve({
            name: "unknown",
            birth_year: "19BBY"
        }));

        const person = await getRandomPersonWithProps(properties);
        expect(person.name).toBe("Luke Skywalker");
        expect(person.birth_year).toBe("19BBY");
    });

    test("Throws error if unable to get valid person after 10 attempts", async () => {
        for (let i = 0; i < 10; i++) {
            utils.fetchItem.mockImplementationOnce(() => Promise.resolve({
                name: "unknown",
                birth_year: "19BBY"
            }));
        };

        expect.assertions(1);
        try {
            await getRandomPersonWithProps(properties);
        }
        catch (e) {
            expect(e.message).toBe("Unable to retrieve a valid person after multiple attempts");
        }
    });
});

describe("validateProperties", () => {
    test("Returns true if person object passed in is valid", () => {
        const person = {
            name: "Plo Koon",
            birth_year: "22BBY"
        }

        expect(validateProperties(person, properties)).toBeTruthy();
    });

    test("Returns false if person passed in is undefined", () => {
        expect(validateProperties(undefined, properties)).toBeFalsy();
    });

    test("Returns false if person passed in is missing name property", () => {
        const person = {
            birth_year: "22BBY"
        };

        expect(validateProperties(person, properties)).toBeFalsy();
    });

    test("Returns false if person passed in is missing birth year property", () => {
        const person = {
            name: "Plo Koon"
        };

        expect(validateProperties(person, properties)).toBeFalsy();
    });

    test("Returns false if person passed in has unknown name", () => {
        const person = {
            name: "unknown",
            birth_year: "22BBY"
        };

        expect(validateProperties(person, properties)).toBeFalsy();
    });

    test("Returns false if person passed in has unknown birth year", () => {
        const person = {
            name: "Plo Koon",
            birth_year: "unknown"
        };

        expect(validateProperties(person, properties)).toBeFalsy();
    });

    test("If no array of properties are passed in, only checks whether person object is not undefined", () => {
        const person = {};

        expect(validateProperties(person)).toBeTruthy();
    });

    test("Throws error if second argument is not an array", () => {
        const person = {
            name: "Plo Koon",
            birth_year: "22BBY"
        }

        expect(() => validateProperties(person, "bad arg"))
            .toThrow("First argument should be a person object and the second an array of properties (eg: 'name', 'birth_year') in string representation");
    });
});