import { validateProperties } from "./validateProperties.js";

describe("validateProperties", () => {
    const properties = Object.freeze(["name", "birth_year"]);
    test("Returns true if person object passed in is valid", () => {
        const person = {
            name: "Plo Koon",
            birth_year: "22BBY"
        }

        expect(validateProperties(person, properties)).toBeTruthy();
    });

    test("Returns false if person passed in is undefined", () => {
        expect(validateProperties(undefined, properties)).toBeFalsy();
    });

    test("Returns false if person passed in is missing name property", () => {
        const person = {
            birth_year: "22BBY"
        };

        expect(validateProperties(person, properties)).toBeFalsy();
    });

    test("Returns false if person passed in is missing birth year property", () => {
        const person = {
            name: "Plo Koon"
        };

        expect(validateProperties(person, properties)).toBeFalsy();
    });

    test("Returns false if person passed in has unknown name", () => {
        const person = {
            name: "unknown",
            birth_year: "22BBY"
        };

        expect(validateProperties(person, properties)).toBeFalsy();
    });

    test("Returns false if person passed in has unknown birth year", () => {
        const person = {
            name: "Plo Koon",
            birth_year: "unknown"
        };

        expect(validateProperties(person, properties)).toBeFalsy();
    });

    test("If no array of properties are passed in, only checks whether person object is not undefined", () => {
        const person = {};

        expect(validateProperties(person)).toBeTruthy();
    });

    test("Throws error if second argument is not an array", () => {
        const person = {
            name: "Plo Koon",
            birth_year: "22BBY"
        }

        expect(() => validateProperties(person, "bad arg"))
            .toThrow("First argument should be a person object and the second an array of properties (eg: 'name', 'birth_year') in string representation");
    });
});
