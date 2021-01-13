import { QuestionView } from "./QuestionView.js";
import { QuestionModel } from "./QuestionModel.js";
import { QuestionController } from "./QuestionController.js";

export function initializeQuizContainer() {
    const quizContainer = document.createElement("div");
    quizContainer.className = "quiz-container";
    quizContainer.innerHTML = `
        <div class="score" data-testid="score">0/0</div>
    `;

    document.body.append(quizContainer);
}

// initializeQuizContainer();
// const questionModel = new QuestionModel();
// const questionView = new QuestionView();
// const questionController = new QuestionController(questionModel, questionView);

// questionModel.createQuestionSet();
