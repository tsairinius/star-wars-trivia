import { QuestionView } from "./QuestionView.js";
import { queryByTestId, screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { question } from "./fakeQuestions.js";
import { cleanUpDOM } from "./utilities/cleanUpDOM.js";
import { TIME_PER_QUESTION_MS } from "./constants.js";
import { initializeTriviaContainer } from "./utilities/initializeTriviaContainer.js";

describe("renderStartScreen", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
        initializeTriviaContainer();
    });

    test("Shows intro text and begin button", () => {
        const view = new QuestionView();
        view.onStartScreenRender = jest.fn();

        view.renderStartScreen();

        expect(screen.getByText("Do you know your Star Wars characters?")).toBeInTheDocument();
        expect(screen.getByText(`5 questions, ${TIME_PER_QUESTION_MS/1000} seconds for each`)).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Begin"}));
    });

    test("Invokes callback when start screen is rendered", () => {
        const view = new QuestionView();
        view.onStartScreenRender = jest.fn();

        view.renderStartScreen();

        expect(view.onStartScreenRender).toHaveBeenCalledTimes(1);
    });

    test("Clicking Begin invokes function to initiate quiz", () => {
        const view = new QuestionView();
        view.onBeginClick = jest.fn();
        view.onStartScreenRender = jest.fn();

        view.renderStartScreen();

        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        expect(view.onBeginClick).toHaveBeenCalledTimes(1);
    });

    test("Throws error if there's no trivia container to render start screen in", () => {
        cleanUpDOM();
        const view = new QuestionView();

        expect(() => view.renderStartScreen()).toThrow(new Error("Missing trivia container to render in"));
    });
});

describe("renderScoreAndTimeBar", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
    });

    test("Displays score and time bar", () => {
        const view = new QuestionView();
        initializeTriviaContainer();
        view.renderScoreAndTimeBar();
    
        expect(screen.getByTestId("score").textContent).toBe("0/0");
        expect(screen.getByTestId("time-bar")).toBeInTheDocument();
    });

    test("If there's no trivia container to render quiz in, throw error", () => {
        const view = new QuestionView();
        expect(() => view.renderScoreAndTimeBar()).toThrow(new Error("Missing trivia container to render in"));
    });
});

describe("displayQuestion", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
        initializeTriviaContainer();
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

    test("Calls function to render loading screen if argument is null", () => {
        const view = new QuestionView();
        view.renderLoadingScreen = jest.fn();

        view.displayQuestion(null);
        expect(view.renderLoadingScreen).toHaveBeenCalledTimes(1);
    });

    test("If loading screen is visible when about to display a question, remove the screen", () => {
        const view = new QuestionView();
        view.renderLoadingScreen();

        view.displayQuestion(question);

        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
});

describe("Next button behavior", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeTriviaContainer();
    });

    test("Next button is enabled when an answer choice is selected", async () => {
        const view = new QuestionView();
        view.renderScoreAndTimeBar();

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

        expect(view.isValidScore(-5, 6)).toBeFalsy();
    });

    test("Returns false if number of correctly answered questions is greater than the number asked", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        const numCorrect = 7;
        const numAsked = 6
        expect(view.isValidScore(numCorrect, numAsked)).toBeFalsy();
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
        initializeTriviaContainer();
    });

    test("Displays 'Score unavailable' if score is invalid", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();
        view.renderScoreAndTimeBar();

        view.updateScore(5);

        expect(screen.getByText("Score unavailable")).toBeInTheDocument();
    });

    test("Updates score", () => {
        const view = new QuestionView();
        view.renderScoreAndTimeBar();

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
        initializeTriviaContainer();
    });

    test("If score is invalid, display `Quiz complete` message along with main menu button", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        view.renderQuizComplete(-1);

        expect(screen.getByText("Quiz completed!")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Main"})).toBeInTheDocument();
    });

    test("Shows user's score and main menu button", () => {
        const view = new QuestionView();

        view.renderQuizComplete(2, 5);
        expect(screen.getByText("You answered 2/5 questions correctly!")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Main"})).toBeInTheDocument();
    });

    test("Clicking main menu button invokes callback to return to main menu", () => {
        const view = new QuestionView();
        view.onMainButtonClick = jest.fn();

        view.renderQuizComplete(2,5);
        userEvent.click(screen.getByRole("button", {name: "Main"}));

        expect(view.onMainButtonClick).toHaveBeenCalledTimes(1);
    });
});

describe("renderLoadingScreen", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
    });

    test("Shows loading screen, without score or time bar", () => {
        const view = new QuestionView();

        initializeTriviaContainer();
        view.renderLoadingScreen();

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("Throws error if unable to find trivia container to render in", () => {
        const view = new QuestionView();

        expect(() => view.renderLoadingScreen()).toThrow(new Error("Could not find trivia container to render in"));
    });
});

describe("getChosenAnswer", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
        initializeTriviaContainer();
    });

    test("Returns the selected answer choice as a string", () => {
        const view = new QuestionView();

        view.displayQuestion(question);

        userEvent.click(screen.getByLabelText(question.answer));
        expect(view.getChosenAnswer()).toBe(question.answer);
    });

    test("If no answer is selected, returns null", () => {
        const view = new QuestionView();

        view.displayQuestion(question);

        expect(view.getChosenAnswer()).toBe(null);
    });
});

describe("updateTimeBar", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeTriviaContainer();
    });

    test("Sets width of time bar element based on percentage passed in", () => {
        const view = new QuestionView();
        view.renderScoreAndTimeBar();

        view.updateTimeBar(45);

        expect(screen.getByTestId("time-bar")).toHaveStyle("width: 45%");
    });

    test("Prints error if no argument is passed in", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();
        view.renderScoreAndTimeBar();

        view.updateTimeBar();

        expect(consoleErrorMock).toHaveBeenCalledWith("Invalid arg. Skipped updating time left on screen. Percentage passed in: undefined");
    });

    test("Prints error if time bar element cannot be found", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        view.updateTimeBar(45);

        expect(consoleErrorMock).toHaveBeenCalledWith("Could not find time bar in DOM to update");
    });
});