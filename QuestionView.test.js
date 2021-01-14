import { QuestionView } from "./QuestionView.js";
import { initializeQuizContainer } from "./app.js";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { question } from "./fakeQuestions.js";
import { cleanUpDOM } from "./utilities/cleanUpDOM.js";

describe("displayQuestion", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
        initializeQuizContainer();
    });

    test("Displays question with answer choices and Next button", () => {
        const view = new QuestionView();
        view.displayQuestion(question);

        expect(screen.getByText("What day is it?")).toBeInTheDocument();
        expect(screen.getByLabelText("Monday")).toBeInTheDocument();
        expect(screen.getByLabelText("Tuesday")).toBeInTheDocument();
        expect(screen.getByLabelText("Wednesday")).toBeInTheDocument();
        expect(screen.getByLabelText("Thursday")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Next"})).toBeInTheDocument();
    });

    test("Throws error if argument is undefined", () => {
        const view = new QuestionView();

        expect(() => view.displayQuestion())
        .toThrow("Missing question as argument");    
    });
});

describe("Next button behavior", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeQuizContainer();
    });

    test("Next button is enabled when an answer choice is selected", async () => {
        const view = new QuestionView();

        view.displayQuestion(question);

        expect(screen.getByRole("button", {name: "Next"})).toBeDisabled();
        userEvent.click(screen.getByLabelText(question.answer));
        expect(screen.getByRole("button", {name: "Next"})).not.toBeDisabled();
    });
});

describe("isValidScore", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Returns true for valid score", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        expect(view.isValidScore(4, 6)).toBeTruthy();
    });

    test("Returns false if missing an argument is undefined", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        expect(view.isValidScore(5, undefined)).toBeFalsy();
        expect(consoleErrorMock)
            .toHaveBeenCalledWith(`Invalid score. The number of questions asked and the number correct must be of type Number. Args: 5, undefined`);
    });

    test("Returns false if argument passed in is not a number", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        expect(view.isValidScore(5, "dog")).toBeFalsy();
    });

    test("Returns false if argument passed in is not a whole number", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        expect(view.updateScore(-5, 6)).toBeFalsy();
    });

    test("Returns false if number of correctly answered questions is greater than the number asked", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        const numCorrect = 7;
        const numAsked = 6
        expect(view.updateScore(numCorrect, numAsked)).toBeFalsy();
        expect(consoleErrorMock)
            .toHaveBeenCalledWith(`Invalid score. Number of questions correct is greater than number of questions asked: Number correct: ${numCorrect}, Number asked: ${numAsked}`);
    });
});

describe("updateScore", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeQuizContainer();
    });

    test("Displays 'Score unavailable' if score is invalid", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        view.updateScore(5);

        expect(screen.getByText("Score unavailable")).toBeInTheDocument();
    });

    test("Updates score", () => {
        const view = new QuestionView();

        expect(screen.queryByText("4/10")).not.toBeInTheDocument();

        view.updateScore(4, 10);

        expect(screen.getByText("4/10")).toBeInTheDocument();
    });
});

describe("renderQuizComplete", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeQuizContainer();
    });

    test("If score is invalid, just display `Quiz complete` message", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        view.renderQuizComplete(-1);

        expect(screen.getByText("Quiz completed!")).toBeInTheDocument();
    });

    test("Shows user's score", () => {
        const view = new QuestionView();

        view.renderQuizComplete(2, 5);
        expect(screen.getByText("You answered 2/5 questions correctly!")).toBeInTheDocument();
    });
});