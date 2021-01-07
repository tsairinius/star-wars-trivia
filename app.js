import { QuestionManager } from "./QuestionManager.js";

// const manager = new QuestionManager();
// manager.createQuestionSet();

export function initializeQuizContainer() {
    const quizContainer = document.createElement("div");
    quizContainer.className = "quiz-container";
    quizContainer.innerHTML = `
        <div class="score" data-testid="score">0/0</div>
    `;

    document.body.append(quizContainer);
}