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

describe("getRandomPeopleIds", () => {
    describe("Math.random generates unique numbers on each iteration (happy case)", () => {
        const randomNumbers = [0, 0.3, 0.9];
        const totalNumPeople = 10;
        const numPeople = 3;
    
        beforeEach(() => {
            Math.random = jest.fn();
            randomNumbers.forEach(num => Math.random = Math.random.mockImplementationOnce(() => num));
        })
    
        test("All returned ID's are unique", () => {
            const idArray = app.getRandomPeopleIds(numPeople, totalNumPeople);
            expect(idArray.some((value, idx) => idArray.indexOf(value) !== idx));
        });
    
        test("All returned ID's are in the range 1 <= id <= (total number of people)", () => {
            const idArray = app.getRandomPeopleIds(numPeople, totalNumPeople);
            idArray.forEach(value => {
                expect(value).toBeLessThanOrEqual(totalNumPeople);
                expect(value).toBeGreaterThanOrEqual(1);
            });
        })
    
        test("Number of ID's returned is equal to number of people passed in", () => {
            const idArray = app.getRandomPeopleIds(numPeople, totalNumPeople);
            expect(idArray.length).toBe(numPeople);
        });
    });

    describe("Math.random generates duplicate numbers", () => {
        const randomNumbers = [0, 0.3, 0.5, 0.3, 0.9];
        const totalNumPeople = 10;
        const numPeople = 4;
    
        beforeEach(() => {
            Math.random = jest.fn();
            randomNumbers.forEach(num => Math.random = Math.random.mockImplementationOnce(() => num));
        })
    
        test("All returned ID's are unique", () => {
            const idArray = app.getRandomPeopleIds(numPeople, totalNumPeople);
            expect(idArray.some((value, idx) => idArray.indexOf(value) !== idx));
        });
    
        test("All returned ID's are in the range 1 <= id <= (total number of people)", () => {
            const idArray = app.getRandomPeopleIds(numPeople, totalNumPeople);
            idArray.forEach(value => {
                expect(value).toBeLessThanOrEqual(totalNumPeople);
                expect(value).toBeGreaterThanOrEqual(1);
            });
        })
    
        test("Number of ID's returned is equal to number of people passed in", () => {
            const idArray = app.getRandomPeopleIds(numPeople, totalNumPeople);
            expect(idArray.length).toBe(numPeople);
        });
    });

    test("Number of ID's returned cannot exceed total number of people passed in", () => {
        const randomNumbers = [0, 0.3, 0.5, 0.7, 0.9];
        const totalNumPeople = 3;
        const numPeople = 5;
        Math.random = jest.fn();
        randomNumbers.forEach(num => Math.random = Math.random.mockImplementationOnce(() => num));

        const idArray = app.getRandomPeopleIds(numPeople, totalNumPeople);
        expect(idArray.length).toBe(totalNumPeople);
    });
});

describe("getPeople", () => {
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
