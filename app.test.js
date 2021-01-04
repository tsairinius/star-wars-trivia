import { QuestionManager } from "./app.js";
import * as utils from "./utilities.js";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";

function cleanUpDOM() {
    document.body.innerHTML = '';
}

describe("displayQuestionStructure", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(cleanUpDOM);

    test("Displays paragraph element, four inputs and labels, and next button", () => {
        const manager = new QuestionManager();

        manager.displayQuestionStructure();

        expect(document.querySelector("p")).toBeInTheDocument();
        expect(document.querySelectorAll("input").length).toBe(4);
        expect(screen.getByRole("button", {name: "Next"})).toBeInTheDocument();
        expect(document.querySelectorAll("label").length).toBe(4);
    });
});

describe("displayQuestion", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    const question = {
        question: "What day is it?",
        answer: "Monday",
        otherOptions: ["Tuesday", "Wednesday", "Thursday"]
    };

    let manager;
    beforeEach(() => {
        cleanUpDOM();
        manager = new QuestionManager();
    });

    test("Displays question with answer choices", () => {
        manager.displayQuestionStructure();
        manager.displayQuestion(question);

        expect(screen.getByText("What day is it?")).toBeInTheDocument();
        expect(screen.getByText("Monday")).toBeInTheDocument();
        expect(screen.getByText("Tuesday")).toBeInTheDocument();
        expect(screen.getByText("Wednesday")).toBeInTheDocument();
        expect(screen.getByText("Thursday")).toBeInTheDocument();
    });

    test("If unable to find question element to insert new question, throw error", () => {
        expect(() => manager.displayQuestion(question))
            .toThrow("Unable to display question and answer choices");
    });

    test("Throws error if argument is undefined", () => {
        expect(() => manager.displayQuestion())
        .toThrow("Missing question as argument");    
    });
});

describe("getAndDisplayQuestion", () => {
    const question = {
        question: "What day is it?",
        answer: "Monday",
        otherOptions: ["Tuesday", "Wednesday", "Thursday"]
    };

    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        cleanUpDOM();
        consoleErrorMock.mockClear();
    })

    test("Question from queue is displayed", () => {
        const manager = new QuestionManager();
        manager.displayQuestionStructure();
        manager.queue.addQuestion(question);

        manager.getAndDisplayQuestion();

        expect(screen.getByText("What day is it?")).toBeInTheDocument();
        expect(screen.getByText("Monday")).toBeInTheDocument();
        expect(screen.getByText("Tuesday")).toBeInTheDocument();
        expect(screen.getByText("Wednesday")).toBeInTheDocument();
        expect(screen.getByText("Thursday")).toBeInTheDocument();
    });

    test("Does not display a question and prints message if unable to retrieve a question", () => {
        consoleErrorMock.mockReturnValue();
        const manager = new QuestionManager();
        manager.displayQuestionStructure();

        expect(() => manager.getAndDisplayQuestion()).not.toThrowError();
        expect(consoleErrorMock).toHaveBeenCalledWith("Could not get a question from queue to display");
    });
});

describe("createQuestion", () => {
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

    console.error = jest.fn();
    utils.createRandomQuestion = jest.fn(() => Promise.resolve(question));
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
        jest.clearAllMocks();
    });

    test("Successfully displays first valid question", async () => {
        const manager = new QuestionManager();
        manager.displayQuestionStructure();
        await manager.createQuestion(); 
        expect(screen.getByText(question.question)).toBeInTheDocument();
    });

    test("Function exits after failing ten times to add a unique question to queue", async () => { 
        const manager = new QuestionManager();
        manager.displayQuestionStructure();
        await manager.createQuestion();        

        expect(await manager.createQuestion()).toBe(1);
        expect(utils.createRandomQuestion).toHaveBeenCalledTimes(11);
        expect(manager.queue.getNumQuestionsAdded()).toBe(1);
    });

    test("If a second valid question is added to queue, the first question is still displayed", async () => {
        const manager = new QuestionManager();
        manager.displayQuestionStructure();

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
        manager.displayQuestionStructure();

        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        await manager.createQuestion();

        expect(await manager.createQuestion()).toBe(0);
        expect(manager.queue.getNumQuestionsAdded()).toBe(1);
    });
});
