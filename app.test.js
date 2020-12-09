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

describe("getRandomPeopleIndices", () => {
    describe("Math.random generates unique numbers on each iteration (happy case)", () => {
        const randomNumbers = [0, 0.3, 0.9];
        const totalNumPeople = 10;
        const numPeople = 3;
    
        beforeEach(() => {
            Math.random = jest.fn();
            randomNumbers.forEach(num => Math.random = Math.random.mockImplementationOnce(() => num));
        })
    
        test("All returned indices are unique", () => {
            const indices = app.getRandomPeopleIndices(numPeople, totalNumPeople);
            expect(indices.some((value, idx) => indices.indexOf(value) !== idx));
        });
    
        test("All returned indices are in the range 1 <= index <= (total number of people)", () => {
            const indices = app.getRandomPeopleIndices(numPeople, totalNumPeople);
            indices.forEach(value => {
                expect(value).toBeLessThanOrEqual(totalNumPeople);
                expect(value).toBeGreaterThanOrEqual(1);
            });
        })
    
        test("Number of indices returned is equal to number of people passed in", () => {
            const indices = app.getRandomPeopleIndices(numPeople, totalNumPeople);
            expect(indices.length).toBe(numPeople);
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
    
        test("All returned indices are unique", () => {
            const indices = app.getRandomPeopleIndices(numPeople, totalNumPeople);
            expect(indices.some((value, idx) => indices.indexOf(value) !== idx));
        });
    
        test("All returned indices are in the range 1 <= index <= (total number of people)", () => {
            const indices = app.getRandomPeopleIndices(numPeople, totalNumPeople);
            indices.forEach(value => {
                expect(value).toBeLessThanOrEqual(totalNumPeople);
                expect(value).toBeGreaterThanOrEqual(1);
            });
        })
    
        test("Number of indices returned is equal to number of people passed in", () => {
            const indices = app.getRandomPeopleIndices(numPeople, totalNumPeople);
            expect(indices.length).toBe(numPeople);
        });
    });

    test("Number of indices returned cannot exceed total number of people passed in", () => {
        const randomNumbers = [0, 0.3, 0.5, 0.7, 0.9];
        const totalNumPeople = 3;
        const numPeople = 5;
        Math.random = jest.fn();
        randomNumbers.forEach(num => Math.random = Math.random.mockImplementationOnce(() => num));

        const indices = app.getRandomPeopleIndices(numPeople, totalNumPeople);
        expect(indices.length).toBe(totalNumPeople);
    });
    
});
