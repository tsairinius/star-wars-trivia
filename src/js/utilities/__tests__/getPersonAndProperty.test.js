import * as p from "../getRandomPersonWithProps.js";
import { getPersonAndProperty } from "../getPersonAndProperty.js";
import * as utils from "../utilities.js";

describe("getPersonAndProperty", () => {
    const person = Object.freeze({
        name: "Luke Skywalker",
        homeworld: "https://swapi.py4e.com/api/planets/1/"
    });

    const homeworld = Object.freeze({
        name: "Tatooine" 
    });

    const invalidHomeworld = Object.freeze({
        name: "unknown"
    });

    const happyResult = {
        person: person.name,
        homeworld: homeworld.name
    };

    let getRandomPersonWithPropsMock, fetchItemMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        getRandomPersonWithPropsMock = jest.spyOn(p, "getRandomPersonWithProps");
        fetchItemMock = jest.spyOn(utils, "fetchItem");
    });

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("Returns object containing person's name and homeworld", async () => {
        getRandomPersonWithPropsMock.mockReturnValueOnce(Promise.resolve(person));
        fetchItemMock.mockReturnValueOnce(Promise.resolve(homeworld));

        expect(await getPersonAndProperty("homeworld")).toEqual(happyResult);
    });

    test("Handles specified property that is saved as array containing a single element", async () => {
        getRandomPersonWithPropsMock.mockReturnValueOnce(Promise.resolve({
            name: "Luke Skywalker",
            species: ["https://swapi.py4e.com/api/species/1/"]
        }));
        fetchItemMock.mockReturnValueOnce(Promise.resolve({name: "Human"}));

        await getPersonAndProperty("species");

        expect(fetchItemMock).toHaveBeenCalledWith("https://swapi.py4e.com/api/species/1/");
    });

    test("Throws error if specified property of person is an array with more than one element", async () => {
        getRandomPersonWithPropsMock.mockReturnValueOnce(Promise.resolve({
            name: "Luke Skywalker",
            species: ["https://swapi.py4e.com/api/species/1/", "https://swapi.py4e.com/api/species/2/"]
        }));

        expect.assertions(1);
        try {
            await getPersonAndProperty("species");
        }
        catch (e) {
            expect(e.message).toContain("Specified property 'species' of Luke Skywalker contains 2 elements. We only handle properties containing a single element")
        }
    });

    test("Throws error if specified property of person is an array with no elements", async () => {
        getRandomPersonWithPropsMock.mockReturnValueOnce(Promise.resolve({
            name: "Luke Skywalker",
            species: []
        }));

        expect.assertions(1);
        try {
            await getPersonAndProperty("species");
        }
        catch (e) {
            expect(e.message).toContain("Specified property 'species' of Luke Skywalker contains 0 elements. We only handle properties containing a single element")
        }
    });

    test("Throws error if unable to retrieve a valid value for the specified property after three attempts", async () => {
        for (let i = 0; i < 3; i++) {
            getRandomPersonWithPropsMock.mockReturnValueOnce(Promise.resolve(person));
            fetchItemMock.mockReturnValueOnce(Promise.resolve(invalidHomeworld));
        }

        expect.assertions(2);
        try {
            await getPersonAndProperty("homeworld");
        }
        catch (e) {
            expect(e.message).toBe("After multiple attempts, a person with a valid homeworld could not be retrieved");
            expect(fetchItemMock).toHaveBeenCalledTimes(3);
        }
    });

    test("Throws error if argument passed in is not of type string", async () => {
        expect.assertions(1);
        try {
            await getPersonAndProperty();
        }
        catch (e) {
            expect(e.message).toBe("Invalid argument: undefined. Must be of type string.")
        }
    });

    test("Throws error if retrieved person object doesn't possess the property passed in as argument", async () => {
        const badProp = "favorite_cuisine";
        getRandomPersonWithPropsMock.mockReturnValueOnce(Promise.resolve(person));
        
        expect.assertions(1);
        try {
            await getPersonAndProperty(badProp);
        }
        catch (e) {
            expect(e.message).toMatch(/The following person object does not possess property/);
        }  
    });

    test("Makes another attempt to retrieve another person and specified property if the property of the first fetched person was invalid", async () => {
        getRandomPersonWithPropsMock
            .mockReturnValueOnce(Promise.resolve(person))
            .mockReturnValueOnce(Promise.resolve(person));
        fetchItemMock
            .mockReturnValueOnce(Promise.resolve(invalidHomeworld))
            .mockReturnValueOnce(Promise.resolve(homeworld));

        expect(await getPersonAndProperty("homeworld")).toEqual(happyResult)
        expect(fetchItemMock).toHaveBeenCalledTimes(2);
    });
});