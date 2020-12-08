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
    const totalNumPeople = 5;
    const numPeople = 3;
    test("All returned indices are unique and less than or equal to the total number of people", () => {
        const indices = app.getRandomPeopleIndices(numPeople, totalNumPeople);
        indices.forEach(value => expect(value).toBeLessThanOrEqual(totalNumPeople));
        expect(indices.some((value, idx) => indices.indexOf(value) !== idx));
    });
});
