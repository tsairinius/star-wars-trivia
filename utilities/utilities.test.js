import * as utils from "./utilities.js";
import * as num from "./getRandomWholeNumber.js";

describe("getItemCountIn", () => {
    const numPeople = 15;
    const defaultNumPeople = 10;

    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        global.fetch = jest.fn();
        consoleErrorMock = jest.spyOn(console, "error");
    });
    
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockReset();
    });

    test("Throws error if endpoint argument is not a string", async () => {
        const invalidArg = [];
        expect.assertions(1);
        try {
            await utils.getItemCountIn(invalidArg, defaultNumPeople);
        }
        catch(e) {
            expect(e.message)
            .toBe("The following args are required: endpoint (string), defaultCount (positive integer)");
        }
    });

    test("Throws error if default count argument is not a number greater than 0", async () => {
        const invalidArg = 0;
        expect.assertions(1);
        try {
            await utils.getItemCountIn("https://swapi.dev/api/people/", invalidArg);
        }
        catch(e) {
            expect(e.message)
            .toBe("The following args are required: endpoint (string), defaultCount (positive integer)");
        }
    }); 

    test("Get item count from a particular endpoint", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({count: numPeople})
        }));
        expect(await utils.getItemCountIn("https://swapi.dev/api/people/", defaultNumPeople))
            .toBe(numPeople);
    });
    
    test("Returns default item count and prints error if unable to access Star Wars API", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.reject("API error"));
        expect(await utils.getItemCountIn("https://swapi.dev/api/people/", defaultNumPeople))
            .toBe(defaultNumPeople);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("When fetch response is not OK, return default count and print error", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false,
            status: 404
        }));

        expect(await utils.getItemCountIn("https://swapi.dev/api/people/", defaultNumPeople))
            .toBe(defaultNumPeople);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Return default count and print message if count property from endpoint is undefined", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({})
        }));

        expect(await utils.getItemCountIn("https://swapi.dev/api/people/", defaultNumPeople))
            .toBe(defaultNumPeople);

        expect(consoleErrorMock)
            .toHaveBeenCalledWith("Unable to access item count from endpoint: ", new Error("Invalid result of undefined retrieved"));
    });

    test("Return default count and print message if count property from endpoint is zero", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({count: 0})
        }));

        expect(await utils.getItemCountIn("https://swapi.dev/api/people/", defaultNumPeople))
            .toBe(defaultNumPeople);

        expect(consoleErrorMock)
            .toHaveBeenCalledWith("Unable to access item count from endpoint: ", new Error("Invalid result of 0 retrieved"));
    });
});

describe("getItemWithId", () => {
    const id = 4;

    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        global.fetch = jest.fn();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockReset();
    });

    test("Throws error if argument endpoint is not a string", async () => {
        const invalidArg = 4;
        expect.assertions(1);
        try {
            await utils.getItemWithId(invalidArg, id);
        }
        catch (e) {
            expect(e.message)
                .toBe("The following args are required: endpoint (string), id (positive integer)");
        }
    });

    test("Throws error if argument id is not a positive integer", async () => {
        const invalidArg = 0;
        expect.assertions(1);
        try {
            await utils.getItemWithId("https://swapi.dev/api/people/", invalidArg);
        }
        catch (e) {
            expect(e.message)
                .toBe("The following args are required: endpoint (string), id (positive integer)");
        }
    });

    test("Fetches from correct endpoint based on ID passed in", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({name: "Luke"})
        }));
        await utils.getItemWithId("https://swapi.dev/api/people/", id);
        expect(fetch).toHaveBeenCalledWith("https://swapi.dev/api/people/4");
    });

    test("Object is returned", async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({name: "Luke"})
        }));

        const person = await utils.getItemWithId("https://swapi.dev/api/people/", id);
        expect(person.name).toBe("Luke");
    });

    test("If fetch for an ID is rejected, null is returned and error message printed", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.reject("API error"));
        const person = await utils.getItemWithId("https://swapi.dev/api/people/", id);

        expect(person).toBe(null);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("If fetch response for an ID is not OK, null is returned and error message printed", async () => {
        consoleErrorMock.mockReturnValueOnce();
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false
        }));
        const person = await utils.getItemWithId("https://swapi.dev/api/people/", id); 

        expect(person).toBe(null);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
});

describe("randomizeArray", () => {
    const array = ["red", "green", "blue", "orange"];

    let getRandomWholeNumberMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        getRandomWholeNumberMock = jest.spyOn(num, "getRandomWholeNumber");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        [2, 0, 1].forEach(number => getRandomWholeNumberMock.mockReturnValueOnce(number));
    });

    test("Returns a new randomized array", () => {
        expect(utils.randomizeArray(array)).toEqual(["orange", "green",  "red", "blue"]);
    });

    test("Array passed in as argument is not modified by function", () => {
        utils.randomizeArray(array);
        expect(array).toEqual(["red", "green", "blue", "orange"]);
    });

    test("Throws error if argument is not an array", () => {
        expect(() => utils.randomizeArray("badArgument"))
            .toThrow(new Error("Argument must be an array with at least one element"));
    });

    test("Throws error if argument is not an array with at least one element", () => {
        expect(() => utils.randomizeArray([]))
            .toThrow(new Error("Argument must be an array with at least one element"));
    });
});