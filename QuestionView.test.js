import { QuestionView } from "./QuestionView.js";
import { QuestionModel } from "./QuestionModel.js";
import { initializeQuizContainer } from "./app.js";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { question } from "./fakeQuestions.js";

const data = Object.freeze({
    currentQuestion: question
});

function cleanUpDOM() {
    document.body.innerHTML = '';
}

describe("displayQuestion", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
        initializeQuizContainer();
    });

    test("Displays question with answer choices and Next button", () => {
        const model = new QuestionModel();
        const view = new QuestionView(model);
        view.displayQuestion(data);

        expect(screen.getByText("What day is it?")).toBeInTheDocument();
        expect(screen.getByLabelText("Monday")).toBeInTheDocument();
        expect(screen.getByLabelText("Tuesday")).toBeInTheDocument();
        expect(screen.getByLabelText("Wednesday")).toBeInTheDocument();
        expect(screen.getByLabelText("Thursday")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Next"})).toBeInTheDocument();
    });

    test("Throws error if argument is undefined", () => {
        const model = new QuestionModel();
        const view = new QuestionView(model);

        expect(() => view.displayQuestion())
        .toThrow("Missing model data as argument");    
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
        const model = new QuestionModel();
        const view = new QuestionView(model);

        view.displayQuestion(data);

        expect(screen.getByRole("button", {name: "Next"})).toBeDisabled();
        userEvent.click(screen.getByLabelText(data.currentQuestion.answer));
        expect(screen.getByRole("button", {name: "Next"})).not.toBeDisabled();
    });
});