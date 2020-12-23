import * as app from "./app.js";

global.fetch = jest.fn();
const consoleErrorMock = jest.spyOn(global.console, "error").mockImplementation();

describe("getTotalNumPeople", () => {
    const numPeople = 15;
    beforeEach(() => {
        fetch.mockClear();
    });

    test("Get total number of people in Star Wars API", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({count: numPeople})
        }));
        expect(await app.getTotalNumPeople()).toBe(numPeople);
    });
    
    test("Handles exception by returning zero and printing error message", async () => {
        // console.error = jest.fn();
        fetch.mockImplementationOnce(() => Promise.reject("API error"));
        expect(await app.getTotalNumPeople()).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("When fetch response is not OK, return zero", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve(() => ({
            ok: false
        })));
        expect(await app.getTotalNumPeople()).toBe(0);
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
        fetch.mockClear();
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
        fetch.mockImplementationOnce(() => Promise.reject());
        const person = await app.getPersonWithId(id);

        expect(person).toBe(null);
    });

    test("If fetch response for an ID is not OK, null is returned and error message printed", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false
        }));
        const person = await app.getPersonWithId(id); 
        expect(person).toBe(null);
    });
})
