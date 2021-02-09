import * as birthYear from "../birthYear.js";
import * as utils from "../utilities/utilities";
import * as p from "../utilities/getRandomPersonWithProps.js";
import * as valid from "../utilities/validateProperties.js";

describe("getBirthYearQuestionAndAnswer", () => {
    let validatePropertiesMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        validatePropertiesMock = jest.spyOn(valid, "validateProperties");
    });

    const invalidPersonError = "Invalid person object passed in as argument. Must have valid name and birth_year properties";
    test("Returns object with personalized question and answer", () => {
        const expectedResult = {
            question: "What year was Plo Koon born?",
            answer: "22BBY"
        };

        const person = {
            name: "Plo Koon",
            birth_year: "22BBY"
        };

        expect(birthYear.getBirthYearQuestionAndAnswer(person)).toEqual(expectedResult);
    });

    test("Throws error if person passed in is not valid", () => {
        validatePropertiesMock.mockReturnValueOnce(false);

        expect(() => birthYear.getBirthYearQuestionAndAnswer())
            .toThrow(invalidPersonError);
    });
});

describe("createRandomBirthYear", () => {
    let mathRandomMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        mathRandomMock = jest.spyOn(global.Math, "random");
    })

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Throws error if reference year passed in is not a string", () => {
        expect(() => birthYear.createRandomBirthYear(25)).toThrow("Argument refYear 25 must be a string ending in BBY or ABY. Ex: '30BBY'");
    });

    test("Throws error if reference year is 'unknown'", () => {
        expect(() => birthYear.createRandomBirthYear("unknown")).toThrow("Argument refYear is 'unknown'");
    });

    test("Throws error if reference year does not end in BBY or ABY", () => {
        expect(() => birthYear.createRandomBirthYear("25")).toThrow("Argument refYear 25 must end in BBY or ABY. Ex: '30BBY'");
    });

    test("Returns year within fifty years of reference year", () => {
        mathRandomMock
            .mockReturnValueOnce(0.4)
            .mockReturnValueOnce(0.6);

        expect(birthYear.createRandomBirthYear("5BBY")).toBe("15BBY");
    });

    test("Returns year to one decimal place based on randomly generated numbers", () => {
        mathRandomMock
            .mockReturnValueOnce(0.1357)
            .mockReturnValueOnce(0.6);

        expect(birthYear.createRandomBirthYear("20ABY")).toBe("16.4BBY");
    });

    test("Returns year as integer based on randomly generated numbers", () => {
        mathRandomMock
            .mockReturnValueOnce(0.1357)
            .mockReturnValueOnce(0.1);

        expect(birthYear.createRandomBirthYear("20ABY")).toBe("17BBY");
    });
});

describe("createBirthYearQuestion", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        utils.getItemCountIn = jest.fn(() => Promise.resolve(10))
        utils.fetchItem = jest.fn(() => Promise.resolve({
            name: "Luke Skywalker",
            birth_year: "19BBY"
        }));
        
        consoleErrorMock = jest.spyOn(console, "error").mockReturnValue();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Returns null/prints error if unable to get valid person after 10 attempts", async () => {
        const getRandomPersonWithPropsMock = jest.spyOn(p, "getRandomPersonWithProps");
        getRandomPersonWithPropsMock.mockImplementationOnce(() => {throw new Error("Could not get a valid person")});

        expect(await birthYear.createBirthYearQuestion()).toBeNull();
        expect(consoleErrorMock)
            .toHaveBeenCalledWith(new Error("Could not get a valid person"));
    });

    test("Returns object with a question, its answer, and three other choices", async () => {
        const result = await birthYear.createBirthYearQuestion();
        expect(result.question).toBe("What year was Luke Skywalker born?");
        expect(result.answer).toBe("19BBY");
        expect(result.otherOptions.length).toBe(3);
    });

    test("Makes another attempt to fetch a valid person if previous person's birth year is invalid", async () => {
        utils.fetchItem.mockImplementationOnce(() => Promise.resolve({
            name: "Luke Skywalker",
            birth_year: "unknown"
        }));

        const result = await birthYear.createBirthYearQuestion();
        expect(result.question).toBe("What year was Luke Skywalker born?");
        expect(result.answer).toBe("19BBY");
    });

    test("Makes another attempt to fetch a valid person if previous person's name is invalid", async () => {
        utils.fetchItem.mockImplementationOnce(() => Promise.resolve({
            name: "unknown",
            birth_year: "19BBY"
        }));

        const result = await birthYear.createBirthYearQuestion();
        expect(result.question).toBe("What year was Luke Skywalker born?");
        expect(result.answer).toBe("19BBY");
    });

    test("Returns null and prints error if getItemCountIn throws an error", async () => {
        utils.getItemCountIn
            .mockImplementationOnce(() => {throw new Error("Unable to get item count")});

        expect(await birthYear.createBirthYearQuestion()).toBeNull();
        expect(consoleErrorMock).toHaveBeenCalledWith(new Error("Unable to get item count"));
    });

    test("Returns null and prints error if fetchItem throws an error", async () => {
        utils.fetchItem
            .mockImplementationOnce(() => {throw new Error("Unable to get person")});

        expect(await birthYear.createBirthYearQuestion()).toBeNull();
        expect(consoleErrorMock).toHaveBeenCalledWith(new Error("Unable to get person"));
    });
});