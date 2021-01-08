import { QuestionView } from "./QuestionView.js";
import { QuestionModel } from "./QuestionModel.js";

export function initializeQuizContainer() {
    const quizContainer = document.createElement("div");
    quizContainer.className = "quiz-container";
    quizContainer.innerHTML = `
        <div class="score" data-testid="score">0/0</div>
    `;

    document.body.append(quizContainer);
}

initializeQuizContainer();
const questionModel = new QuestionModel();
const questionView = new QuestionView(questionModel);

// questionModel.createQuestion();
// questionModel.createQuestionSet();

// const question = {
//     question: "What day is it?",
//     answer: "Monday",
//     otherOptions: ["Tuesday", "Wednesday", "Thursday"]
// };

// const data = {
//     currentQuestion: question
// }
// questionView.displayQuestion(data);

