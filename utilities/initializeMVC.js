import { QuestionController } from "../QuestionController.js";
import { QuestionModel } from "../QuestionModel.js";
import { QuestionView } from "../QuestionView.js";

export function initializeMVC(numQuestions) {
    const model = new QuestionModel(numQuestions);
    const view = new QuestionView();
    const controller = new QuestionController(model, view);

    return {model, view, controller};
}