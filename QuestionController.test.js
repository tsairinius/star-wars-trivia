import { QuestionController } from "./QuestionController.js";
import { QuestionModel } from "./QuestionModel.js";
import { QuestionView } from "./QuestionView.js";

describe("validateAndGetNextQuestion", () => {
    test("Calls model's validateAndGetNextQuestion", () => {
        const model = new QuestionModel();
        const view = new QuestionView();
        const controller = new QuestionController(model, view);

        model.validateAnswerAndGetNextQuestion = jest.fn();

        expect(model.validateAnswerAndGetNextQuestion).not.toHaveBeenCalled();
        controller.validateAnswerAndGetNextQuestion();
        expect(model.validateAnswerAndGetNextQuestion).toHaveBeenCalledTimes(1);
    });
});

describe("handleModelChange", () => {
    test("Throws error if argument is undefined", () => {
        const model = new QuestionModel();
        const view = new QuestionView();
        const controller = new QuestionController(model, view);
        expect(() => controller.handleModelChange()).toThrow(new TypeError("Data argument is undefined"));
    });

    test("Requests to have 'quiz complete' page rendered if quiz is complete", () => {
        const consoleLogMock = jest.spyOn(console, "log").mockReturnValue();
        const data = {
            quizComplete: true
        };

        const model = new QuestionModel();
        const view = new QuestionView();
        const controller = new QuestionController(model, view);

        view.renderQuizComplete = jest.fn();

        controller.handleModelChange(data);

        expect(view.renderQuizComplete).toHaveBeenCalledTimes(1);
    });

    test("Requests to have next question displayed and score updated if quiz is not complete", () => {
        const data = {
            quizComplete: false
        };

        const model = new QuestionModel();
        const view = new QuestionView();
        const controller = new QuestionController(model, view);

        view.displayQuestion = jest.fn();
        view.updateScore = jest.fn();

        controller.handleModelChange(data);

        expect(view.displayQuestion).toHaveBeenCalledTimes(1);
        expect(view.updateScore).toHaveBeenCalledTimes(1);
    });
});