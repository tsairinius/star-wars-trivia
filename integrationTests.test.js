import { QuestionView } from "./QuestionView.js";
import { QuestionModel } from "./QuestionModel.js";
import { cleanUpDOM } from "./utilities/cleanUpDOM.js";
import { screen } from "@testing-library/dom";
import * as utils from "./utilities/utilities.js";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { question, secondQuestion, fakeQuestions } from "./fakeQuestions.js";
import { QuestionController } from "./QuestionController.js";
import * as creator from "./utilities/createRandomQuestion.js";
import { initializeMVC } from "./utilities/initializeMVC.js";

describe("Start screen", () => {
    let createRandomQuestionMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        createRandomQuestionMock = jest.spyOn(creator, "createRandomQuestion");
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("When user clicks begin button, first question of quiz is displayed", async () => {
        cleanUpDOM();
        const numQuestions = 1;

        const { model, view, controller } = initializeMVC(numQuestions);
        
        createRandomQuestionMock.mockReturnValueOnce(fakeQuestions[0]);

        view.initializeTriviaContainer();
        await view.renderStartScreen();
        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        expect(screen.getByText(fakeQuestions[0].question)).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Next"})).toBeInTheDocument();
        expect(screen.queryByText("button", {name: "Begin"})).not.toBeInTheDocument();
    });
});

describe("Quiz screen", () => {
    const setUpQuizArea = (view, model) => {
        view.initializeTriviaContainer();
        view.renderScoreAndTimeBar();
        model.isQuizRunning = true;
    }

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

        const { model, view, controller } = initializeMVC();

        setUpQuizArea(view, model);

        await model.createQuestion();
        await model.createQuestion();

        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        document.querySelectorAll("input[type=radio]").forEach(input => expect(input.checked).toBeFalsy());
        expect(screen.getByRole("button", {name: "Next"})).toBeDisabled();
    });

    test("When user selects an answer choice and clicks Next, a new question is displayed", async () => {
        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        const { model, view, controller } = initializeMVC();

        setUpQuizArea(view, model);

        await model.createQuestion();
        await model.createQuestion();

        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByText("What color is the sky?")).toBeInTheDocument();
        expect(screen.getByLabelText("blue")).toBeInTheDocument();
        expect(screen.getByLabelText("yellow")).toBeInTheDocument();
        expect(screen.getByLabelText("red")).toBeInTheDocument();
        expect(screen.getByLabelText("green")).toBeInTheDocument();
    });

    test("Displays that 1/1 questions were answered correctly when user answers first question correctly", async () => {
        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question));

        const { model, view, controller } = initializeMVC();

        setUpQuizArea(view, model);

        await model.createQuestion();

        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByTestId("score").textContent).toBe("1/1");
    });

    test("Displays that 0/1 questions were answered correctly when user answers first question incorrectly", async () => {
        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question));

        const { model, view, controller } = initializeMVC();
        
        setUpQuizArea(view, model);

        await model.createQuestion();

        const wrongAnswer = question.otherOptions[0];
        userEvent.click(screen.getByLabelText(wrongAnswer));

        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByTestId("score").textContent).toBe("0/1");
    });
});




