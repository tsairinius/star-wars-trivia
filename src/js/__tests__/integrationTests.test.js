import { cleanUpDOM } from "../utilities/cleanUpDOM.js";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { question, secondQuestion, fakeQuestions } from "../fakeQuestions.js";
import * as creator from "../utilities/createRandomQuestion.js";
import { initializeMVC } from "../utilities/initializeMVC.js";
import { initializeDOM } from "../utilities/initializeDOM.js";

describe("Start screen", () => {
    let createRandomQuestionMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        createRandomQuestionMock = jest.spyOn(creator, "createRandomQuestion");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
    });

    test("When user clicks begin button, first question of quiz is displayed and data port animation is triggered", async () => {
        cleanUpDOM();
        const numQuestions = 1;

        const { model, view, controller } = initializeMVC(numQuestions);
        view.triggerDataPortAnimation = jest.fn();
        
        createRandomQuestionMock.mockReturnValueOnce(Promise.resolve(fakeQuestions[0]));

        initializeDOM();
        await view.initializeView();
        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        expect(screen.getByText(fakeQuestions[0].question)).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Next"})).toBeInTheDocument();
        expect(screen.queryByText("button", {name: "Begin"})).not.toBeInTheDocument();
        expect(view.triggerDataPortAnimation).toHaveBeenCalledTimes(1);
    });
});

describe("Quiz screen", () => {
    let consoleErrorMock;
    let createRandomQuestionMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error").mockReturnValue();
        createRandomQuestionMock = jest.spyOn(creator, "createRandomQuestion");
    });

    beforeEach(() => {
        jest.resetAllMocks();
        cleanUpDOM();
    });

    test("When a new question is displayed after another, the Next button is disabled again and no answer choices are selected", async () => {
        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        const { model, view, controller } = initializeMVC(2);

        initializeDOM();

        await view.initializeView();

        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        document.querySelectorAll("input[type=radio]").forEach(input => expect(input.checked).toBeFalsy());
        expect(screen.getByRole("button", {name: "Next"})).toBeDisabled();
    });

    test("When user selects an answer choice and clicks Next, a new question is displayed", async () => {
        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        const { model, view, controller } = initializeMVC(2);

        initializeDOM();

        await view.initializeView();

        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByText("What color is the sky?")).toBeInTheDocument();
        expect(screen.getByLabelText("blue")).toBeInTheDocument();
        expect(screen.getByLabelText("yellow")).toBeInTheDocument();
        expect(screen.getByLabelText("red")).toBeInTheDocument();
        expect(screen.getByLabelText("green")).toBeInTheDocument();
    });

    test("When user answers first question correctly, displays 1-2 (1 answered correctly, now on question 2)", async () => {
        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion))

        const { model, view, controller } = initializeMVC(2);

        initializeDOM();

        await view.initializeView();
        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByTestId("score").textContent).toBe("1-2");
    });

    test("When user answers first question correctly and clicks next, triggers animations accordingly", async () => {
        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question));

        const { model, view, controller } = initializeMVC(1);
        
        view.triggerLightbulbAnimation = jest.fn();
        view.triggerDataPortAnimation = jest.fn();
        initializeDOM();

        await view.initializeView();
        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        userEvent.click(screen.getByLabelText(question.answer));

        view.triggerLightbulbAnimation.mockClear();
        view.triggerDataPortAnimation.mockClear();

        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(view.triggerDataPortAnimation).toHaveBeenCalledTimes(1);
        expect(view.triggerLightbulbAnimation).toHaveBeenCalledWith(true);
    });

    test("When user answers first question incorrectly, displays 0-2 (0 questions answer correctly, now on second question)", async () => {
        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        const { model, view, controller } = initializeMVC(2);
        
        initializeDOM();

        await view.initializeView();
        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        const wrongAnswer = question.otherOptions[0];
        userEvent.click(screen.getByLabelText(wrongAnswer));

        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByTestId("score").textContent).toBe("0-2");
    });

    test("When user answers first question incorrectly and clicks next, triggers animations accordingly", async () => {
        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question));

        const { model, view, controller } = initializeMVC(1);
        
        view.triggerLightbulbAnimation = jest.fn();
        view.triggerDataPortAnimation = jest.fn();
        initializeDOM();

        await view.initializeView();
        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        const wrongAnswer = question.otherOptions[0];
        userEvent.click(screen.getByLabelText(wrongAnswer));

        view.triggerLightbulbAnimation.mockClear();
        view.triggerDataPortAnimation.mockClear();

        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(view.triggerDataPortAnimation).toHaveBeenCalledTimes(1);
        expect(view.triggerLightbulbAnimation).toHaveBeenCalledWith(false);
    });
});

describe("Returning to start screen after quiz is complete", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    test("Displays start screen when using clicks on main menu button", () => {
        const { model, view, controller } = initializeMVC();

        view.onStartScreenRender = jest.fn();

        initializeDOM();
        view.renderQuizComplete(3,5);

        userEvent.click(screen.getByRole("button", {name: "Main"}));

        expect(screen.getByRole("button", {name: "Begin"})).toBeInTheDocument();
        expect(screen.getByText("CHALMUN'S CANTINA PRESENTS")).toBeInTheDocument();
        expect(screen.queryByRole("button", {name: "Main"})).not.toBeInTheDocument();
    });
});

describe("Playing another round of trivia after completing a round", () => {
    let createRandomQuestionMock;
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        createRandomQuestionMock = jest.spyOn(creator, "createRandomQuestion");
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.resetAllMocks();
        cleanUpDOM();
        initializeDOM();
    });

    test("Shows question when clicking Begin to start second round", async () => {
        consoleErrorMock.mockReturnValueOnce();
        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        const {model, view, controller} = initializeMVC(1);

        await view.initializeView();

        userEvent.click(screen.getByRole("button", {name: "Begin"}));
        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));
        await userEvent.click(screen.getByRole("button", {name: "Main"}));
        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        expect(screen.getByText(secondQuestion.question)).toBeInTheDocument();
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
});

describe("Showing 'quiz complete' screen when quiz is finished", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
    });

    test("Quiz complete screen is shown when user clicks next button for last question of quiz", async () => {
        const numQuestions = 1;
        const createRandomQuestionMock = jest.spyOn(creator, "createRandomQuestion");
        createRandomQuestionMock.mockReturnValueOnce(Promise.resolve(question));
        const consoleErrorMock = jest.spyOn(console, "error").mockReturnValueOnce();
        const { model, view, controller } = initializeMVC(numQuestions);

        initializeDOM();
        await view.initializeView();
        userEvent.click(screen.getByRole("button", {name: "Begin"}));
        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByRole("button", {name: "Main"})).toBeInTheDocument();
    });
});

describe("Loading screen behavior", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
    });

    test("Loading screen appears after starting quiz if no question is available yet", () => {
        const numQuestions = 1;
        const { model, view, controller } = initializeMVC(numQuestions);
        view.onStartScreenRender = jest.fn();

        initializeDOM();
        view.initializeView();

        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("Loading screen is replaced with first question once received", async () => {
        const createRandomQuestionMock = jest.spyOn(creator, "createRandomQuestion")
            .mockReturnValueOnce(question);
        const numQuestions = 1;
        const { model, view, controller } = initializeMVC(numQuestions);

        const onStartScreenRenderOriginal = view.onStartScreenRender;
        view.onStartScreenRender = jest.fn();

        initializeDOM();
        view.initializeView();

        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        expect(screen.getByText("Loading...")).toBeInTheDocument();

        view.onStartScreenRender = onStartScreenRenderOriginal;

        await model.createQuestion();

        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        expect(screen.getByText(question.question)).toBeInTheDocument();
    });
});
