import * as app from "./app.js";
import { jest } from "@jest/globals";

describe("getTotalNumPeople", () => {
    const numPeople = 15;
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({count: numPeople})
    }));

    test("Get total number of people in Star Wars API", async () => {
        expect(await app.getTotalNumPeople()).toBe(numPeople);
    });
    
    test("Handles exception by returning zero", async () => {
        fetch.mockImplementationOnce(() => Promise.reject("API error"));
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
    // const people = [
    //     {name: "Luke Skywalker", id: 1},
    //     {name: "Han Solo", id: 2},
    //     {name: "Leia Organa", id: 3},
    //     {name: "Darth Vader", id: 4},
    //     {name: "Obi-Wan Kenobi", id: 5}
    // ];

    // const getPerson = id => {
    //     let result;
    //     people.forEach(person => {
    //         if (person.id === id) {
    //             result = person;
    //         }
    //     })
    //     return result;
    // }

    // global.fetch = jest.fn((ids) => Promise.resolve(getPerson))

    global.fetch = jest.fn();

    test("Retrieves correct people based on ID's passed in", () => {
        const peopleIds = [4, 2, 5];
        app.getPeople(peopleIds);

        expect(fetch).toHaveBeenNthCalledWith(1, "https://swapi.dev/api/people/4");
        expect(fetch).toHaveBeenNthCalledWith(2, "https://swapi.dev/api/people/2");
        expect(fetch).toHaveBeenNthCalledWith(3, "https://swapi.dev/api/people/5")
    });
})
