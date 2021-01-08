import { QuestionModel } from "./QuestionModel.js";
import * as utils from "./utilities/utilities.js";
// import { screen } from "@testing-library/dom";
// import "@testing-library/jest-dom";
// import userEvent from "@testing-library/user-event";

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

// function cleanUpDOM() {
//     document.body.innerHTML = '';
// }

// describe("validateAnswer", () => {

// });

// describe("addSubscriber", () => {

// });

// describe("callSubscribers", () => {

// });

// describe("validateAnswerAndGetNextQuestion", () => {

// });

describe("getNextQuestion", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        consoleErrorMock.mockClear();
    });

    test("Returns 0 if a question is successfully retrieved", () => {
        const model = new QuestionModel();
        model.queue.addQuestion(question);

        expect(model.getNextQuestion()).toBe(0);
    });

    test("Current question is saved", () => {
        const model = new QuestionModel();
        model.queue.addQuestion(question);

        model.getNextQuestion();
        expect(model.currentQuestion).toEqual(question);
    });

    test("Number of questions asked is incremented", () => {
        const model = new QuestionModel();
        model.queue.addQuestion(question);

        expect(model.numQuestionsAsked).toBe(0);
        model.getNextQuestion();
        expect(model.numQuestionsAsked).toBe(1);
    });

    test("Prints error message if unable to retrieve a question", () => {
        consoleErrorMock.mockReturnValue();
        const model = new QuestionModel();

        expect(() => model.getNextQuestion()).not.toThrowError();
        expect(consoleErrorMock).toHaveBeenCalledWith("Could not get a question from queue to display");
    });

    test("Returns 1 if unable to retrieve a question", () => {
        consoleErrorMock.mockReturnValue();
        const model = new QuestionModel();

        expect(model.getNextQuestion()).toBe(1);
    });
});

describe("createQuestion", () => {
    console.error = jest.fn();
    beforeAll(() => {
        jest.restoreAllMocks();
        utils.createRandomQuestion = jest.fn(() => Promise.resolve(question));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Successfully displays first valid question", async () => {
        const displayQuestionMock = jest.fn();

        const model = new QuestionModel();
        model.addSubscriber(displayQuestionMock);
        await model.createQuestion(); 
        expect(displayQuestionMock).toHaveBeenCalledTimes(1);
    });

    test("Function exits after failing ten times to add a unique question to queue", async () => { 
        const model = new QuestionModel();
        await model.createQuestion();        

        expect(await model.createQuestion()).toBe(1);
        expect(utils.createRandomQuestion).toHaveBeenCalledTimes(11);
        expect(model.queue.getNumQuestionsAdded()).toBe(1);
    });

    test("If a second valid question is added to queue, the first question is still the currently asked question", async () => {
        const model = new QuestionModel();

        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        await model.createQuestion(); 
        await model.createQuestion(); 

        expect(model.currentQuestion).toEqual(question);
        expect(model.queue.getNumQuestionsAdded()).toBe(2);
    });

    test("Does not add another question to queue if queue has already received max number of valid questions", async () => {
        const max = 1;
        const model = new QuestionModel(max);

        utils.createRandomQuestion
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        await model.createQuestion();

        expect(await model.createQuestion()).toBe(0);
        expect(model.queue.getNumQuestionsAdded()).toBe(1);
    });
});


