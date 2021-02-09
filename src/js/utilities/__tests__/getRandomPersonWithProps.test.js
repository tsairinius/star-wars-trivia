import { getRandomPersonWithProps } from "../getRandomPersonWithProps.js";
import * as utils from "../utilities.js";

describe("getRandomPersonWithProps", () => {
    const properties = Object.freeze(["name", "birth_year"]);
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