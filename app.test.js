import * as app from "./app.js";

global.fetch = jest.fn();

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
        console.error = jest.fn();
        fetch.mockImplementationOnce(() => Promise.reject("API error"));
        expect(await app.getTotalNumPeople()).toBe(0);
        expect(console.error).toHaveBeenCalledTimes(1);
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

    const peopleIds = [4, 2, 5];
    beforeEach(() => {
        fetch.mockClear();
    });

    test("Fetches from correct endpoint based on ID's passed in", async () => {
        await app.getPeople(peopleIds);

        expect(fetch).toHaveBeenNthCalledWith(1, "https://swapi.dev/api/people/4");
        expect(fetch).toHaveBeenNthCalledWith(2, "https://swapi.dev/api/people/2");
        expect(fetch).toHaveBeenNthCalledWith(3, "https://swapi.dev/api/people/5");
    });

    test("Array of person objects is returned", async () => {
        const people = await app.getPeople(peopleIds);
        people.forEach(person => expect(person.name).toBe("Luke"));
    });

    test("If fetch for an ID is reject, no object is added to array of people", async () => {
        fetch.mockImplementationOnce(() => Promise.reject());
        const people = await app.getPeople(peopleIds);

        expect(people.length).toBe(2);
        people.forEach(person => expect(person.name).toBe("Luke"));
    });

    test("If fetch response for an ID is not OK, no object is added to array of people", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false
        }));
        const people = await app.getPeople(peopleIds); 

        expect(people.length).toBe(2);
        people.forEach(person => expect(person.name).toBe("Luke"));
    });
})
