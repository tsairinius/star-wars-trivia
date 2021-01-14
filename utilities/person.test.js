import { getRandomPerson } from "./person.js";
import * as utils from "./utilities.js";

describe("getRandomPerson", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        utils.getItemCountIn = jest.fn(() => Promise.resolve(10))
        utils.getItemWithId = jest.fn(() => Promise.resolve({
            name: "Luke Skywalker",
            birth_year: "19BBY"
        }));
        
        consoleErrorMock = jest.spyOn(console, "error").mockReturnValue();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Returns person object", async () => {
        const person = await getRandomPerson();
        expect(person.name).toBe("Luke Skywalker");
        expect(person.birth_year).toBe("19BBY");
    });

    test("Makes another attempt to fetch a valid person if previous person's birth year is invalid", async () => {
        utils.getItemWithId.mockImplementationOnce(() => Promise.resolve({
            name: "Luke Skywalker",
            birth_year: "unknown"
        }));

        const person = await getRandomPerson();
        expect(person.name).toBe("Luke Skywalker");
        expect(person.birth_year).toBe("19BBY");
    });

    test("Makes another attempt to fetch a valid person if previous person's name is invalid", async () => {
        utils.getItemWithId.mockImplementationOnce(() => Promise.resolve({
            name: "unknown",
            birth_year: "19BBY"
        }));

        const person = await getRandomPerson();
        expect(person.name).toBe("Luke Skywalker");
        expect(person.birth_year).toBe("19BBY");
    });

    test("Throws error if unable to get valid person after 10 attempts", async () => {
        for (let i = 0; i < 10; i++) {
            utils.getItemWithId.mockImplementationOnce(() => Promise.resolve({
                name: "unknown",
                birth_year: "19BBY"
            }));
        };

        expect.assertions(1);
        try {
            await getRandomPerson();
        }
        catch (e) {
            expect(e.message).toBe("Unable to retrieve a valid person after multiple attempts");
        }
    });
});