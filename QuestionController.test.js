import { QuestionController } from "./QuestionController.js";
import { QuestionModel } from "./QuestionModel.js";
import { QuestionView } from "./QuestionView.js";

const initializeMVC = () => {
    const model = new QuestionModel();
    const view = new QuestionView();
    const controller = new QuestionController(model, view);

    return {model, view, controller};
}

describe("validateAndGetNextQuestion", () => {
    test("Calls model's validateAndGetNextQuestion", () => {
        const {model, view, controller} = initializeMVC();

        model.validateAnswerAndGetNextQuestion = jest.fn();

        expect(model.validateAnswerAndGetNextQuestion).not.toHaveBeenCalled();
        controller.validateAnswerAndGetNextQuestion();
        expect(model.validateAnswerAndGetNextQuestion).toHaveBeenCalledTimes(1);
    });
});

describe("handleModelChange", () => {
    test("Throws error if argument is undefined", () => {
        const {model, view, controller} = initializeMVC();

        expect(() => controller.handleModelChange()).toThrow(new TypeError("Data argument is undefined"));
    });

    test("Requests to have 'quiz complete' page rendered if quiz is complete", () => {
        const consoleLogMock = jest.spyOn(console, "log").mockReturnValue();
        const data = {
            quizComplete: true
        };

        const {model, view, controller} = initializeMVC();

        view.renderQuizComplete = jest.fn();

        controller.handleModelChange(data);

        expect(view.renderQuizComplete).toHaveBeenCalledTimes(1);
    });

    test("Requests to have next question displayed and score updated if quiz is not complete", () => {
        const data = {
            quizComplete: false
        };

        const {model, view, controller} = initializeMVC();

        view.displayQuestion = jest.fn();
        view.updateScore = jest.fn();

        controller.handleModelChange(data);

        expect(view.displayQuestion).toHaveBeenCalledTimes(1);
        expect(view.updateScore).toHaveBeenCalledTimes(1);
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
        view.renderTimeBar = jest.fn();

        const badArg = undefined;
        controller.handleTimeChange(badArg);

        expect(view.getChosenAnswer).not.toHaveBeenCalled();
        expect(controller.validateAnswerAndGetNextQuestion).not.toHaveBeenCalled();
        expect(view.renderTimeBar).not.toHaveBeenCalled();
        expect(consoleErrorMock).toHaveBeenCalledWith(`Invalid argument passed as time left: undefined. Must be a percentage of type Number`);
    });

    test("If percentage passed in is equal to 0, validate currently chosen answer and get next question", () => {
        const {model, view, controller} = initializeMVC();

        view.getChosenAnswer = jest.fn();
        controller.validateAnswerAndGetNextQuestion = jest.fn();
        view.renderTimeBar = jest.fn();

        controller.handleTimeChange(0);

        expect(view.getChosenAnswer).toHaveBeenCalledTimes(1);
        expect(controller.validateAnswerAndGetNextQuestion).toHaveBeenCalledTimes(1);
        expect(view.renderTimeBar).not.toHaveBeenCalled();
    });

    test("If percentage passed in is greater than 0, update view to show updated time left", () => {
        const {model, view, controller} = initializeMVC();

        view.getChosenAnswer = jest.fn();
        controller.validateAnswerAndGetNextQuestion = jest.fn();
        view.renderTimeBar = jest.fn();

        controller.handleTimeChange(1);

        expect(view.getChosenAnswer).not.toHaveBeenCalled();
        expect(controller.validateAnswerAndGetNextQuestion).not.toHaveBeenCalled();
        expect(view.renderTimeBar).toHaveBeenCalledTimes(1);
    });
});