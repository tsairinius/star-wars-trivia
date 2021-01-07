import { QuestionManager } from "./QuestionManager.js";
import * as utils from "./utilities/utilities.js";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const question = {
    question: "What day is it?",
    answer: "Monday",
    otherOptions: ["Tuesday", "Wednesday", "Thursday"]
};

const secondQuestion = {
    question: "What color is the sky?",
    answer: "blue",
    otherOptions: ["yellow", "red", "green"]
};

function cleanUpDOM() {
    document.body.innerHTML = '';
}

describe("displayQuestion", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(cleanUpDOM);

    test("Displays question with answer choices and Next button", () => {
        const manager = new QuestionManager();
        manager.displayQuestion(question);

        expect(screen.getByText("What day is it?")).toBeInTheDocument();
        expect(screen.getByLabelText("Monday")).toBeInTheDocument();
        expect(screen.getByLabelText("Tuesday")).toBeInTheDocument();
        expect(screen.getByLabelText("Wednesday")).toBeInTheDocument();
        expect(screen.getByLabelText("Thursday")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Next"})).toBeInTheDocument();
    });

    test("Throws error if argument is undefined", () => {
        const manager = new QuestionManager();

        expect(() => manager.displayQuestion())
        .toThrow("Missing question as argument");    
    });
});

describe("getAndDisplayQuestion", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        cleanUpDOM();
        consoleErrorMock.mockClear();
    });

    test("Question from queue is displayed", () => {
        const manager = new QuestionManager();
        manager.queue.addQuestion(question);

        manager.getAndDisplayQuestion();

        expect(screen.getByText("What day is it?")).toBeInTheDocument();
        expect(screen.getByText("Monday")).toBeInTheDocument();
        expect(screen.getByText("Tuesday")).toBeInTheDocument();
        expect(screen.getByText("Wednesday")).toBeInTheDocument();
        expect(screen.getByText("Thursday")).toBeInTheDocument();
    });

    test("Correct answer to question is saved", () => {
        const manager = new QuestionManager();
        manager.queue.addQuestion(question);

        manager.getAndDisplayQuestion();
        expect(manager.correctAnswer).toBe(question.answer);
    });

    test("Number of questions asked is incremented", () => {
        const manager = new QuestionManager();
        manager.queue.addQuestion(question);

        expect(manager.numQuestionsAsked).toBe(0);
        manager.getAndDisplayQuestion();
        expect(manager.numQuestionsAsked).toBe(1);
    });

    test("Does not display a question and prints message if unable to retrieve a question", () => {
        consoleErrorMock.mockReturnValue();
        const manager = new QuestionManager();

        expect(() => manager.getAndDisplayQuestion()).not.toThrowError();
        expect(consoleErrorMock).toHaveBeenCalledWith("Could not get a question from queue to display");
    });
});

describe("createQuestion", () => {
    console.error = jest.fn();
    beforeAll(() => {
        jest.restoreAllMocks();
        utils.createRandomQuestion = jest.fn(() => Promise.resolve(question));
    });

    beforeEach(() => {
        cleanUpDOM();
        jest.clearAllMocks();
    });

    test("Successfully displays first valid question", async () => {
        const manager = new QuestionManager();
        await manager.createQuestion(); 
        expect(screen.getByText(question.question)).toBeInTheDocument();
    });

    test("Function exits after failing ten times to add a unique question to queue", async () => { 
        const manager = new QuestionManager();
        await manager.createQuestion();        

        expect(await manager.createQuestion()).toBe(1);
        expect(utils.createRandomQuestion).toHaveBeenCalledTimes(11);
        expect(manager.queue.getNumQuestionsAdded()).toBe(1);
    });

    test("If a second valid question is added to queue, the first question is still displayed", async () => {
        const manager = new QuestionManager();

        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        await manager.createQuestion(); 
        await manager.createQuestion(); 

        expect(screen.getByText(question.question)).toBeInTheDocument();
        expect(screen.queryByText(secondQuestion.question)).not.toBeInTheDocument();
        expect(manager.queue.getNumQuestionsAdded()).toBe(2);
    });

    test("Does not add another question to queue if queue has already received max number of valid questions", async () => {
        const max = 1;
        const manager = new QuestionManager(max);

        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        await manager.createQuestion();

        expect(await manager.createQuestion()).toBe(0);
        expect(manager.queue.getNumQuestionsAdded()).toBe(1);
    });
});

describe("Next button behavior", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
        utils.createRandomQuestion = jest.fn(() => Promise.resolve(question))
    });

    beforeEach(() => {
        cleanUpDOM();
        jest.clearAllMocks();
    });

    test("Next button is enabled when an answer choice is selected", async () => {
        const manager = new QuestionManager();
        await manager.createQuestion();

        expect(screen.getByRole("button", {name: "Next"})).toBeDisabled();
        userEvent.click(screen.getByLabelText(question.answer));
        expect(screen.getByRole("button", {name: "Next"})).not.toBeDisabled();
    });
});

describe("Integration tests", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
        utils.createRandomQuestion = jest.fn()
    });

    beforeEach(() => {
        cleanUpDOM();
        jest.clearAllMocks();
    });

    test("When a new question is displayed after another, the Next button is disabled again and no answer choices are selected", async () => {
        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));
        
        const manager = new QuestionManager();

        await manager.createQuestion();
        await manager.createQuestion();

        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        document.querySelectorAll("input[type=radio]").forEach(input => expect(input.checked).toBeFalsy());
        expect(screen.getByRole("button", {name: "Next"})).toBeDisabled();
    });

    test("Displays that 1/1 questions were answered correctly when user answers first question correctly", async () => {
        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question));

        const manager = new QuestionManager();

        await manager.createQuestion();

        userEvent.click(screen.getByLabelText(question.answer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByTestId("score").textContent).toBe("1/1");
    });

    test("Displays that 0/1 questions were answered correctly when user answers first question incorrectly", async () => {
        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question));

        const manager = new QuestionManager();

        await manager.createQuestion();

        const wrongAnswer = question.otherOptions[0];
        userEvent.click(screen.getByLabelText(wrongAnswer));
        userEvent.click(screen.getByRole("button", {name: "Next"}));

        expect(screen.getByTestId("score").textContent).toBe("0/1");
    });
    
});