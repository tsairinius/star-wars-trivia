import * as utils from "./utilities/utilities.js";

export class QuestionView {
    constructor(questionModel) {
        this.questionModel = questionModel;

        this.questionModel.addSubscriber(this.displayQuestion.bind(this));
        this.questionModel.addSubscriber(this.updateScore.bind(this));

        this.enableNextButton = () => {
            const next = document.querySelector(".next-button");
            next.disabled = false;
        };
    };

    updateScore(data) {
        const scoreElement = document.querySelector(".score");
        scoreElement.textContent = `${data.numQuestionsCorrect}/${data.numQuestionsAsked}`;
    }

    displayQuestion(data) {
        if (!data) {
            throw new Error("Missing model data as argument");
        };

        const question = data.currentQuestion;
    
        if (document.querySelector(".question-container")) {
            document.querySelector(".question-container").remove();
        };
    
        const answerChoices = utils.randomizeArray([question.answer, ...question.otherOptions]);
    
        const questionContainer = document.createElement("div");
        questionContainer.setAttribute("class", "question-container");
        questionContainer.innerHTML = `
            <p class="question">${question.question}</p>
            <div>
                <input data-testid="answer-choice-1" type="radio" name="answer-choice" id="answer-choice-1" value=${answerChoices[0]} />
                <label for="answer-choice-1">${answerChoices[0]}</label>
            </div>
            <div>
                <input data-testid="answer-choice-2" type="radio" name="answer-choice" id="answer-choice-2" value=${answerChoices[1]} />
                <label for="answer-choice-2">${answerChoices[1]}</label>
            </div>
            <div>
                <input data-testid="answer-choice-3" type="radio" name="answer-choice" id="answer-choice-3" value=${answerChoices[2]} />
                <label for="answer-choice-3">${answerChoices[2]}</label>
            </div>
            <div>
                <input data-testid="answer-choice-4" type="radio" name="answer-choice" id="answer-choice-4" value=${answerChoices[3]} />
                <label for="answer-choice-4">${answerChoices[3]}</label>
            </div>
            <button class="next-button" disabled>Next</button>
        `;
    
        questionContainer.querySelector(".next-button").onclick = this.questionModel.validateAnswerAndGetNextQuestion;
        questionContainer.querySelectorAll("input[type=radio]")
            .forEach(input => input.onchange = this.enableNextButton);
    
        const quizContainer = document.querySelector(".quiz-container");
        quizContainer.appendChild(questionContainer);
    };
}