import * as randNum from "../getRandomWholeNumber.js";
import { getRandomItem } from "../getRandomItem.js";
import { PLANETS } from "../../planets.js";

describe("getRandomItem", () => {
    let getRandomWholeNumberMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        getRandomWholeNumberMock = jest.spyOn(randNum, "getRandomWholeNumber");
    });

    test("Returns a planet name", () => {
        getRandomWholeNumberMock.mockReturnValueOnce(5);
        expect(getRandomItem(PLANETS)).toBe("Ord Mantell");
    });

    test("Throws error if an array is not passed in as an argument", () => {
        expect(() => getRandomItem()).toThrow(new TypeError("Invalid argument: undefined. Must be an array"));
    });
});