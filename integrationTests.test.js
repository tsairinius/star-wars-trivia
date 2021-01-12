import { QuestionView } from "./QuestionView.js";
import { QuestionModel } from "./QuestionModel.js";
import { initializeQuizContainer } from "./app.js";
import { cleanupDOM } from "./cleanupDOM.js";
import { screen } from "@testing-library/dom";
import * as utils from "./utilities/utilities.js";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { question, secondQuestion } from "./fakeQuestions.js";

describe("Integration tests", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error").mockReturnValue();
        utils.createRandomQuestion = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanupDOM();
        initializeQuizContainer();
    });

    test("When a new question is displayed after another, the Next button is disabled again and no answer choices are selected", async () => {
        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));
        
        const model = new QuestionModel();
        const view = new QuestionView(model);

        await model.createQuestion();
        await model.createQuestion();

        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        document.querySelectorAll("input[type=radio]").forEach(input => expect(input.checked).toBeFalsy());
        expect(screen.getByRole("button", {name: "Next"})).toBeDisabled();
    });

    test("When user selects an answer choice and clicks Next, a new question is displayed", async () => {
        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        const model = new QuestionModel();
        const view = new QuestionView(model);

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
        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question));

        const model = new QuestionModel();
        const view = new QuestionView(model);

        await model.createQuestion();

        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByTestId("score").textContent).toBe("1/1");
    });

    test("Displays that 0/1 questions were answered correctly when user answers first question incorrectly", async () => {
        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question));

        const model = new QuestionModel();
        const view = new QuestionView(model);

        await model.createQuestion();

        const wrongAnswer = question.otherOptions[0];
        userEvent.click(screen.getByLabelText(wrongAnswer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByTestId("score").textContent).toBe("0/1");
    });
});




