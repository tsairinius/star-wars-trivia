import { QuestionController } from "./QuestionController.js";
import { initializeMVC } from "./utilities/initializeMVC.js";
import { question } from "./fakeQuestions.js";

describe("startQuiz", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Invokes view and model to render score and time bar, display first question, set timer, and trigger data port animation", () => {
        const { model, view, controller } = initializeMVC();

        view.renderScoreAndTimeBar = jest.fn();
        view.displayQuestion = jest.fn();
        view.triggerDataPortAnimation = jest.fn();
        model.setTimer = jest.fn();

        expect(model.isQuizRunning).toBeFalsy();
        model.currentQuestion = question;

        controller.startQuiz();

        expect(view.renderScoreAndTimeBar).toHaveBeenCalledTimes(1);
        expect(view.displayQuestion).toHaveBeenCalledTimes(1);
        expect(model.setTimer).toHaveBeenCalledTimes(1);
        expect(model.isQuizRunning).toBeTruthy();
        expect(view.triggerDataPortAnimation).toHaveBeenCalledTimes(1);
    });

    test("Does not set timer if no question can be retrieved from model", () => {
        const { model, view, controller } = initializeMVC();

        view.renderScoreAndTimeBar = jest.fn();
        view.displayQuestion = jest.fn();
        view.triggerDataPortAnimation = jest.fn();
        model.setTimer = jest.fn();

        controller.startQuiz();

        expect(model.setTimer).not.toHaveBeenCalled();
        expect(view.renderScoreAndTimeBar).toHaveBeenCalledTimes(1);
        expect(view.displayQuestion).toHaveBeenCalledTimes(1);
        expect(model.isQuizRunning).toBeTruthy();
    });
});

describe("validateAndGetNextQuestion", () => {
    test("Calls view to trigger lightbulb animation based on model's response to user's answer", () => {
        const {model, view, controller} = initializeMVC();

        const isValidAnswer = false;
        model.validateAnswerAndGetNextQuestion = jest.fn().mockReturnValueOnce(isValidAnswer);
        view.triggerLightbulbAnimation = jest.fn();

        expect(model.validateAnswerAndGetNextQuestion).not.toHaveBeenCalled();
        expect(view.triggerLightbulbAnimation).not.toHaveBeenCalled();
        controller.validateAnswerAndGetNextQuestion();
        expect(model.validateAnswerAndGetNextQuestion).toHaveBeenCalledTimes(1);
        expect(view.triggerLightbulbAnimation).toHaveBeenCalledWith(isValidAnswer);
    });
});

describe("handleModelChange", () => {
    test("Throws error if argument is undefined", () => {
        const {model, view, controller} = initializeMVC();

        expect(() => controller.handleModelChange()).toThrow(new TypeError("Data argument is undefined"));
    });

    test("Cancels any animation frame callbacks that's running and requests to have 'quiz complete' page rendered if quiz is complete", () => {
        const consoleLogMock = jest.spyOn(console, "log").mockReturnValue();
        const data = {
            quizComplete: true,
            isQuizRunning: false
        };

        const {model, view, controller} = initializeMVC();
        model.isQuizRunning= true;

        view.renderQuizComplete = jest.fn();
        model.cancelTimer = jest.fn();

        controller.handleModelChange(data);

        expect(view.renderQuizComplete).toHaveBeenCalledTimes(1);
        expect(model.cancelTimer).toHaveBeenCalledTimes(1);
        expect(model.isQuizRunning).toBeFalsy();
    });

    test("Cancels any animation frame callbacks and requests to have next question displayed and score updated if quiz is not complete", () => {
        const data = {
            quizComplete: false,
            isQuizRunning: true,
            currentQuestion: question
        };

        const {model, view, controller} = initializeMVC();
        model.isQuizRunning = true;

        view.displayQuestion = jest.fn();
        view.updateScore = jest.fn();
        model.cancelTimer = jest.fn();
        model.setTimer = jest.fn();

        controller.handleModelChange(data);

        expect(view.displayQuestion).toHaveBeenCalledTimes(1);
        expect(view.updateScore).toHaveBeenCalledTimes(1);
        expect(model.cancelTimer).toHaveBeenCalledTimes(1);
        expect(model.setTimer).toHaveBeenCalledTimes(1);
    });

    test("If no question is available from model, skip setting timer", () => {
        const data = {
            quizComplete: false,
            isQuizRunning: true
        };

        const {model, view, controller} = initializeMVC();
        model.isQuizRunning = true;

        view.displayQuestion = jest.fn();
        view.updateScore = jest.fn();
        model.cancelTimer = jest.fn();
        model.setTimer = jest.fn();

        controller.handleModelChange(data);

        expect(view.displayQuestion).toHaveBeenCalledTimes(1);
        expect(view.updateScore).toHaveBeenCalledTimes(1);
        expect(model.cancelTimer).toHaveBeenCalledTimes(1);
        expect(model.setTimer).not.toHaveBeenCalled();
    });
});

describe("resetQuiz", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    test("Requests model and view to reset data and display main menu", () => {
        const { model, view, controller } = initializeMVC();

        model.resetData = jest.fn();
        view.renderStartScreen = jest.fn();

        controller.resetQuiz();

        expect(model.resetData).toHaveBeenCalledTimes(1);
        expect(view.renderStartScreen).toHaveBeenCalledTimes(1);
    });
});

describe("handleTimeChange", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("If percentage passed in is not valid, print an error message", () => {
        consoleErrorMock.mockReturnValue();

        const {model, view, controller} = initializeMVC();

        view.getChosenAnswer = jest.fn();
        controller.validateAnswerAndGetNextQuestion = jest.fn();
        view.updateTimeBar = jest.fn();

        const badArg = undefined;
        controller.handleTimeChange(badArg);

        expect(view.getChosenAnswer).not.toHaveBeenCalled();
        expect(controller.validateAnswerAndGetNextQuestion).not.toHaveBeenCalled();
        expect(view.updateTimeBar).not.toHaveBeenCalled();
        expect(consoleErrorMock).toHaveBeenCalledWith(`Invalid argument passed as time left: undefined. Must be a percentage of type Number`);
    });

    test("If percentage passed in is equal to 0, validate currently chosen answer and get next question", () => {
        const {model, view, controller} = initializeMVC();

        view.getChosenAnswer = jest.fn();
        controller.validateAnswerAndGetNextQuestion = jest.fn();
        view.updateTimeBar = jest.fn();

        controller.handleTimeChange(0);

        expect(view.getChosenAnswer).toHaveBeenCalledTimes(1);
        expect(controller.validateAnswerAndGetNextQuestion).toHaveBeenCalledTimes(1);
        expect(view.updateTimeBar).not.toHaveBeenCalled();
    });

    test("If percentage passed in is greater than 0, update view to show updated time left", () => {
        const {model, view, controller} = initializeMVC();

        view.getChosenAnswer = jest.fn();
        controller.validateAnswerAndGetNextQuestion = jest.fn();
        view.updateTimeBar = jest.fn();

        controller.handleTimeChange(1);

        expect(view.getChosenAnswer).not.toHaveBeenCalled();
        expect(controller.validateAnswerAndGetNextQuestion).not.toHaveBeenCalled();
        expect(view.updateTimeBar).toHaveBeenCalledTimes(1);
    });
});