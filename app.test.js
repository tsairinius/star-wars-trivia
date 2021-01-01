import * as app from "./app.js";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";

function cleanUpDOM() {
    document.body.innerHTML = '';
}

describe("displayQuestionStructure", () => {
    beforeEach(cleanUpDOM);

    test("Displays paragraph element, four inputs and labels, and next button", () => {
        app.displayQuestionStructure();

        expect(document.querySelector("p")).toBeInTheDocument();
        expect(document.querySelectorAll("input").length).toBe(4);
        expect(screen.getByRole("button", {name: "Next"})).toBeInTheDocument();
        expect(document.querySelectorAll("label").length).toBe(4);
    });
});

describe("displayNewQuestion", () => {
    const question = {
        question: "What day is it?",
        answer: "Monday",
        otherOptions: ["Tuesday", "Wednesday", "Thursday"]
    };

    beforeEach(() => {
        cleanUpDOM();
    });

    test("Displays question with answer choices", () => {
        app.displayQuestionStructure();
        app.displayNewQuestion(question);

        expect(screen.getByText("What day is it?")).toBeInTheDocument();
        expect(screen.getByText("Monday")).toBeInTheDocument();
        expect(screen.getByText("Tuesday")).toBeInTheDocument();
        expect(screen.getByText("Wednesday")).toBeInTheDocument();
        expect(screen.getByText("Thursday")).toBeInTheDocument();
    });

    test("If unable to find question element to insert new question, throw error", () => {
        expect(() => app.displayNewQuestion(question))
            .toThrow("Unable to display question and answer choices");
    });

    test("Throws error if argument is undefined", () => {
        expect(() => app.displayNewQuestion())
        .toThrow("Invalid question passed in. Must have valid question, answer, and three other choices");    
    });

    test("Throws error if question property of argument is undefined", () => {
        const badQuestion = {
            question: undefined,
            answer: "Monday",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        };

        expect(() => app.displayNewQuestion(badQuestion))
            .toThrow("Invalid question passed in. Must have valid question, answer, and three other choices");
    });

    test("Throws error if answer property of argument is 'unknown'", () => {
        const badQuestion = {
            question: "What day is it?",
            answer: "unknown",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        };

        expect(() => app.displayNewQuestion(badQuestion))
            .toThrow("Invalid question passed in. Must have valid question, answer, and three other choices");
    });

    test("Throws error if answer property of argument is undefined", () => {
        const badQuestion = {
            question: "What day is it?",
            answer: undefined,
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        };

        expect(() => app.displayNewQuestion(badQuestion))
            .toThrow("Invalid question passed in. Must have valid question, answer, and three other choices");
    });

    test("Throws error if there are not three other answer choices in argument", () => {
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: ["Wednesday", "Thursday"]
        };

        expect(() => app.displayNewQuestion(badQuestion))
        .toThrow("Invalid question passed in. Must have valid question, answer, and three other choices");
    });

    test("Throws error if one of the other answer choices in argument is unknown", () => {
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: ["unknown", "Wednesday", "Thursday"]
        };

        expect(() => app.displayNewQuestion(badQuestion))
        .toThrow("Invalid question passed in. Must have valid question, answer, and three other choices");
    });

    test("Throws error if one of the other answer choices in argument is undefined", () => {
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: [undefined, "Wednesday", "Thursday"]
        };

        expect(() => app.displayNewQuestion(badQuestion))
        .toThrow("Invalid question passed in. Must have valid question, answer, and three other choices");
    });

});

