import { initializeQuizContainer } from "./app.js";
import { QuestionQueue } from "./QuestionQueue.js";
import * as utils from "./utilities/utilities.js";

export class QuestionManager {

    constructor(maxQuestions = 10) {
        this.queue = new QuestionQueue(maxQuestions);
        this.maxQuestions = maxQuestions;
        this.numQuestionsCorrect = 0;
        this.numQuestionsAsked = 0;

        initializeQuizContainer();

        this.validateAnswerAndGetNextQuestion = () => {
            this.validateAnswer();
            this.getAndDisplayQuestion();
        };

        this.enableNextButton = () => {
            const next = document.querySelector(".next-button");
            next.disabled = false;
        };

    }

    createQuestionSet() {
        for (let i = 0; i < this.maxQuestions; i++) {
            this.createQuestion();
        }
    };

    getAndDisplayQuestion() {
        const question = this.queue.getQuestion();
        if (question) {
            this.correctAnswer = question.answer;
            this.displayQuestion(question);
            this.numQuestionsAsked++;
        }
        else {
            console.error("Could not get a question from queue to display");
        }
    };

    validateAnswer() {
        const chosenAnswer = document.querySelector("input[name=answer-choice]:checked").value;
        if (chosenAnswer === this.correctAnswer) {
            this.numQuestionsCorrect++;
        }

        const scoreElement = document.querySelector(".score");
        scoreElement.textContent = `${this.numQuestionsCorrect}/${this.numQuestionsAsked}`;
    };

    async createQuestion() {
        for (let i = 0; i < 10; i++) {
            if (this.queue.getNumQuestionsAdded() >= this.maxQuestions) {
                return 0;
            };

            const question = await utils.createRandomQuestion();
            const result = this.queue.addQuestion(question);

            if (result === 0) {
                if (!document.querySelector(".question-container")) {
                    this.getAndDisplayQuestion(question);
                };
                return 0;
            }
        };

        return 1;
    };
    
    displayQuestion(question) {
        if (!question) {
            throw new Error("Missing question as argument");
        };

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
    
        questionContainer.querySelector(".next-button").onclick = this.validateAnswerAndGetNextQuestion;
        questionContainer.querySelectorAll("input[type=radio]")
            .forEach(input => input.onchange = this.enableNextButton);

        const quizContainer = document.querySelector(".quiz-container");
        quizContainer.appendChild(questionContainer);
    };
}