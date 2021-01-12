import { QuestionModel } from "./QuestionModel.js";
import * as utils from "./utilities/utilities.js";
import { question, secondQuestion } from "./fakeQuestions.js";

describe("addSubscriber", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    test("Succesfully adds function to array of subscribers", () => {
        const mockSubscriber = jest.fn();
        const model = new QuestionModel();

        expect(model.subscribers).toEqual([]);
        model.addSubscriber(mockSubscriber);
        expect(model.subscribers).toEqual([mockSubscriber]);
    });

    test("Throws error if missing argument", () => {
        const model = new QuestionModel();

        expect(() => model.addSubscriber())
            .toThrow(new TypeError("A function was not passed in as an argument"));
    });

    test("Throws error if argument passed in is not a function", () => {
        const model = new QuestionModel();

        expect(() => model.addSubscriber("bad argument"))
            .toThrow(new TypeError("A function was not passed in as an argument"));
    });
});

describe("callSubscribers", () => {
    let createRandomQuestion;
    beforeAll(() => {
        jest.restoreAllMocks();
        createRandomQuestion = jest.spyOn(utils, "createRandomQuestion")
            .mockReturnValue(Promise.resolve({
                ...question,
                otherOptions: [...question.otherOptions]
            }));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Calls each subscriber in array of subscribers", async () => {
        const firstSubscriber = jest.fn();
        const secondSubscriber = jest.fn();
        const model = new QuestionModel();

        await model.createQuestion();
        model.addSubscriber(firstSubscriber);
        model.addSubscriber(secondSubscriber);

        expect(firstSubscriber).toHaveBeenCalledTimes(0);
        expect(secondSubscriber).toHaveBeenCalledTimes(0);

        model.callSubscribers();
        expect(firstSubscriber).toHaveBeenCalledTimes(1);
        expect(secondSubscriber).toHaveBeenCalledTimes(1);
    });

    test("Each subscriber is provided data stored in model", async () => {
        const firstSubscriber = jest.fn();

        const model = new QuestionModel();

        await model.createQuestion();
        model.addSubscriber(firstSubscriber);
        model.callSubscribers();

        const expectedData = {
            currentQuestion: model.currentQuestion,
            numQuestionsCorrect: model.numQuestionsCorrect,
            numQuestionsAsked: model.numQuestionsAsked
        };
        expect(firstSubscriber).toHaveBeenCalledWith(expectedData);
    });

    test("Manipulating properties of model data passed to subscriber does not change original model's data properties", async () => {
        const firstSubscriber = jest.fn((data) => {
            data.currentQuestion = {},
            data.numQuestionsAsked = 23,
            data.numQuestionsCorrect = 36
        });

        const model = new QuestionModel();

        await model.createQuestion();
        model.addSubscriber(firstSubscriber);
        model.callSubscribers();

        expect(model.currentQuestion).toEqual(question);
        expect(model.numQuestionsAsked).toBe(1);
        expect(model.numQuestionsCorrect).toBe(0);
    });

    test("Changing properties of current question of argument does not change original model's data", async () => {
        const firstSubscriber = jest.fn((data) => {
            data.currentQuestion.question = secondQuestion.question;
            data.currentQuestion.answer = secondQuestion.answer;
            data.currentQuestion.otherOptions = secondQuestion.otherOptions;
        });

        const model = new QuestionModel();

        await model.createQuestion();
        model.addSubscriber(firstSubscriber);
        model.callSubscribers();

        expect(model.currentQuestion).toEqual(question);
    });

    test("Changing items in array of other answer choices passed to subscriber doesn't change original model's data", async () => {
        const firstSubscriber = jest.fn((data) => {
            data.currentQuestion.otherOptions[0] = "new choice";
        });

        const model = new QuestionModel();

        await model.createQuestion();
        model.addSubscriber(firstSubscriber);
        model.callSubscribers();

        expect(model.currentQuestion).toEqual(question);
    });
});

describe("validateAnswerAndGetNextQuestion", () => {
    let consoleErrorMock, createRandomQuestionMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error").mockReturnValue();
        createRandomQuestionMock = jest.spyOn(utils, "createRandomQuestion")
            .mockReturnValue(Promise.resolve(question));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("If chosen answer is correct, increment number of correct answers", async () => {
        const model = new QuestionModel();

        await model.createQuestion();
        const chosenAnswer = question.answer;

        expect(model.numQuestionsCorrect).toBe(0);
        model.validateAnswerAndGetNextQuestion(chosenAnswer);

        expect(model.numQuestionsCorrect).toBe(1);
    });

    test("If chosen answer is incorrect, number of correct answers is not incremented", async () => {
        const model = new QuestionModel();

        await model.createQuestion();
        const chosenAnswer = question.otherOptions[0];

        expect(model.numQuestionsCorrect).toBe(0);
        model.validateAnswerAndGetNextQuestion(chosenAnswer);

        expect(model.numQuestionsCorrect).toBe(0);
    });

    test("Next question should be retrieved and subscribers called", async () => {
        const model = new QuestionModel();
        await model.createQuestion();

        const chosenAnswer = question.otherOptions[0];
        model.getNextQuestion = jest.fn();
        model.callSubscribers = jest.fn();
        
        model.validateAnswerAndGetNextQuestion(chosenAnswer);

        expect(model.getNextQuestion).toHaveBeenCalledTimes(1);
        expect(model.callSubscribers).toHaveBeenCalledTimes(1);
    });
});

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
    let consoleErrorMock;
    let createRandomQuestionMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        createRandomQuestionMock = jest.spyOn(utils, "createRandomQuestion")
            .mockReturnValue(Promise.resolve(question));

        consoleErrorMock = jest.spyOn(console, "error").mockReturnValue();
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
        expect(createRandomQuestionMock).toHaveBeenCalledTimes(11);
        expect(model.queue.getNumQuestionsAdded()).toBe(1);
    });

    test("If a second valid question is added to queue, the first question is still the currently asked question", async () => {
        const model = new QuestionModel();

        createRandomQuestionMock
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

        createRandomQuestionMock
            .mockReturnValueOnce(Promise.resolve(question))
            .mockReturnValueOnce(Promise.resolve(secondQuestion));

        await model.createQuestion();

        expect(await model.createQuestion()).toBe(0);
        expect(model.queue.getNumQuestionsAdded()).toBe(1);
    });
});


