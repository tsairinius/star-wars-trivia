import { QuestionController } from "./QuestionController.js";
import { QuestionModel } from "./QuestionModel.js";
import { QuestionView } from "./QuestionView.js";

export function startApp() {
    document.addEventListener("DOMContentLoaded", () => {
        const questionModel = new QuestionModel(5);
        const questionView = new QuestionView();
        const questionController = new QuestionController(questionModel, questionView);
    
        questionView.initializeView();
    })
}



