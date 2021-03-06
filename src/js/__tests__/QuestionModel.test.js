import { QuestionModel } from "../QuestionModel.js";
import { question, secondQuestion } from "../fakeQuestions.js";
import * as creator from "../utilities/createRandomQuestion.js";
import { TIME_PER_QUESTION_MS } from "../constants.js"
import { computePercentage } from "../utilities/computePercentage.js";

describe("resetData", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    test("Resets data except for callbacks tied to controller", () => {
        const maxQuestions = 4;
        const handleTimeChange = jest.fn();
        const subscriber = jest.fn();

        const model = new QuestionModel(maxQuestions);
        model.onTimeChange = handleTimeChange;
        model.addSubscriber(subscriber);

        model.resetData();

        expect(model.queue.getNumQuestionsAdded()).toBe(0);
        expect(model.queue.queue.length).toBe(0);
        expect(model.currentQuestion).toBeNull();
        expect(model.maxQuestions).toBe(maxQuestions);
        expect(model.numQuestionsAsked).toBe(0);
        expect(model.numQuestionsCorrect).toBe(0);
        expect(model.quizComplete).toBe(false);
        expect(model.isQuizRunning).toBe(false);
        expect(model.timeLeft).toBe(TIME_PER_QUESTION_MS);
        expect(model.prevTime).toBeNull();
        expect(model.animationId).toBeNull();

        expect(model.onTimeChange).toBe(handleTimeChange);
        expect(model.subscribers).toEqual([subscriber]);
    });
});

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
        createRandomQuestion = jest.spyOn(creator, "createRandomQuestion")
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
            numQuestionsAsked: model.numQuestionsAsked,
            quizComplete: model.quizComplete,
            isQuizRunning: model.isQuizRunning
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

    test("Sends current question property as null if there is no current question", () => {
        const model = new QuestionModel();

        model.callSubscribers();

        expect(model.currentQuestion).toBeNull();
    });
});

describe("setIsQuizRunning", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    test("Sets value of isQuizRunning", () => {
        const model = new QuestionModel();

        expect(model.isQuizRunning).toBe(false);
        model.setIsQuizRunning(true);
        expect(model.isQuizRunning).toBe(true);
    });

    test("Throws error if argument is not boolean", () => {
        const model = new QuestionModel();

        expect(() => model.setIsQuizRunning("badArg")).toThrow(new TypeError(`Argument is not of type bool. Arg: badArg`))
    });
});

describe("validateAnswerAndGetNextQuestion", () => {
    let consoleErrorMock, createRandomQuestionMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error").mockReturnValue();
        createRandomQuestionMock = jest.spyOn(creator, "createRandomQuestion")
            .mockReturnValue(Promise.resolve(question));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("If chosen answer is correct, increment number of correct answers and return true", async () => {
        const model = new QuestionModel();
        model.isQuizRunning = true;

        await model.createQuestion();
        const chosenAnswer = question.answer;

        expect(model.numQuestionsCorrect).toBe(0);
        const isValid = model.validateAnswerAndGetNextQuestion(chosenAnswer);

        expect(model.numQuestionsCorrect).toBe(1);
        expect(isValid).toBeTruthy();
    });

    test("If chosen answer is incorrect, number of correct answers is not incremented and false is returned", async () => {
        const model = new QuestionModel();
        model.isQuizRunning = true;

        await model.createQuestion();
        const chosenAnswer = question.otherOptions[0];

        expect(model.numQuestionsCorrect).toBe(0);
        const isValid = model.validateAnswerAndGetNextQuestion(chosenAnswer);

        expect(model.numQuestionsCorrect).toBe(0);
        expect(isValid).toBeFalsy();
    });

    test("Next question should be retrieved and subscribers called", async () => {
        const model = new QuestionModel();
        model.isQuizRunning = true;

        await model.createQuestion();

        const chosenAnswer = question.otherOptions[0];
        model.getNextQuestion = jest.fn();
        model.callSubscribers = jest.fn();
        
        model.validateAnswerAndGetNextQuestion(chosenAnswer);

        expect(model.getNextQuestion).toHaveBeenCalledTimes(1);
        expect(model.callSubscribers).toHaveBeenCalledTimes(1);
    });

    test("If chosen answer is null, number of correct answers is not incremented", async () => {
        const model = new QuestionModel();
        model.isQuizRunning = true;

        await model.createQuestion();

        expect(model.numQuestionsCorrect).toBe(0);
        model.validateAnswerAndGetNextQuestion(null);
        expect(model.numQuestionsCorrect).toBe(0);
    });

    test("If queue is empty and number of questions asked is equal to the max number of questions, signal that the quiz is complete", async () => {
        const maxQuestions = 3;        
        const model = new QuestionModel(maxQuestions);
        model.isQuizRunning = true;

        await model.createQuestion();

        expect(model.quizComplete).toBeFalsy();
        model.numQuestionsAsked = maxQuestions;
        model.validateAnswerAndGetNextQuestion();
        expect(model.quizComplete).toBeTruthy();
    });

    test("If queue is empty and number of question asked is not equal to the max number of questions, set current question to null", async () => {
        const maxQuestions = 3;        
        const model = new QuestionModel(maxQuestions);
        model.isQuizRunning = true;

        model.currentQuestion = question;
        model.validateAnswerAndGetNextQuestion();
        expect(model.currentQuestion).toBeNull();
        expect(model.quizComplete).toBeFalsy();
        expect(model.isQuizRunning).toBeTruthy();
    });
});

describe("setTimer", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Sets time left back to max time allowed per question and queues call to getTimeLeft", () => {
        const model = new QuestionModel();
        const requestAnimationFrameMock = jest.spyOn(window, "requestAnimationFrame");
        model.getTimeLeft = jest.fn();

        model.timeLeft = TIME_PER_QUESTION_MS - (TIME_PER_QUESTION_MS/2);
        model.setTimer();

        expect(model.timeLeft).toBe(TIME_PER_QUESTION_MS);
        expect(requestAnimationFrameMock).toHaveBeenCalledWith(model.getTimeLeft);
    });
});

describe("getTimeLeft", () => {
    const currentTimestamp = 15000;
    const previousTimestamp = 10000;
    const initialTimeLeft = 25000;

    let requestAnimationFrameMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        requestAnimationFrameMock = jest.spyOn(window, "requestAnimationFrame");
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Computes time left for question and sets previous time recorded to be current timestamp", () => {
        requestAnimationFrameMock.mockReturnValue();
        const model = new QuestionModel();;

        model.onTimeChange = jest.fn();
        model.prevTime = previousTimestamp;
        model.timeLeft = initialTimeLeft;
        model.getTimeLeft(currentTimestamp);

        expect(model.timeLeft).toBe(20000);
        expect(model.prevTime).toBe(currentTimestamp);
    });

    test("Passes time left as percentage to controller", () => {
        requestAnimationFrameMock.mockReturnValue();
        const model = new QuestionModel();;

        model.onTimeChange = jest.fn();
        model.prevTime = previousTimestamp;
        model.timeLeft = initialTimeLeft;
        model.getTimeLeft(currentTimestamp);

        expect(model.onTimeChange).toHaveBeenCalledWith(model.timeLeft);
    });

    test("Queues itself to be called again and saves the new request ID if time left is greater than 0", () => {
        const requestId = 123;
        requestAnimationFrameMock.mockReturnValue(requestId);
        const model = new QuestionModel();;

        model.onTimeChange = jest.fn();
        model.prevTime = previousTimestamp;
        model.timeLeft = initialTimeLeft;
        model.getTimeLeft(currentTimestamp);

        expect(requestAnimationFrameMock).toHaveBeenCalled();
        expect(model.animationId).toBe(requestId);
    });

    test("Does not queue itself to be called again if time left is 0", () => {
        requestAnimationFrameMock.mockReturnValue();
        const model = new QuestionModel();;

        model.onTimeChange = jest.fn();
        model.prevTime = previousTimestamp;
        model.timeLeft = 2000;

        model.getTimeLeft(currentTimestamp);

        expect(requestAnimationFrameMock).not.toHaveBeenCalled();
    });

    test("When called for the first time, time left should not change v alue", () => {
        requestAnimationFrameMock.mockReturnValue();
        const model = new QuestionModel();;

        model.onTimeChange = jest.fn();
        model.timeLeft = initialTimeLeft;
        model.getTimeLeft(currentTimestamp);

        expect(model.timeLeft).toBe(initialTimeLeft);
    });
});

describe("cancelTimer", () => {
    let cancelAnimationFrameMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        cancelAnimationFrameMock = jest.spyOn(window, "cancelAnimationFrame");
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

   test("Calls cancelAnimationFrame using current saved request ID", () => {
        cancelAnimationFrameMock.mockImplementationOnce();
        const model = new QuestionModel();
        model.animationId = 50;
        model.cancelTimer();

        expect(cancelAnimationFrameMock).toHaveBeenCalledWith(50);
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
        createRandomQuestionMock = jest.spyOn(creator, "createRandomQuestion")
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


