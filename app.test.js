import { getTotalNumPeople } from "./app.js";
import { jest } from "@jest/globals";

describe("getTotalNumPeople", () => {
    const numPeople = 15;
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({count: numPeople})
    }));

    test("Get total number of people in Star Wars API", async () => {
        expect(await getTotalNumPeople()).toBe(numPeople);
    });
    
    test("Handles exception by returning zero", async () => {
        fetch.mockImplementationOnce(() => Promise.reject("API error"));
        expect(await getTotalNumPeople()).toBe(0);
    });
})
