import { QuestionQueue } from "./QuestionQueue.js";
import * as utils from "./utilities.js";

export class QuestionManager {

    constructor(maxQuestions = 10) {
        this.queue = new QuestionQueue(maxQuestions);
        this.maxQuestions = maxQuestions;

        this.getAndDisplayQuestion = () => {
            const question = this.queue.getQuestion();
            if (question) {
                this.displayQuestion(question);
            }
            else {
                console.error("Could not get a question from queue to display");
            }
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
        }
        
        try {
            if (document.querySelector(".question-container")) {
                document.querySelector(".question-container").remove();
            };

            const questionContainer = this.createQuestionContainer();
            const questionElement = questionContainer.querySelector(".question");
            questionElement.textContent = question.question;

            const answerChoices = [question.answer, ...question.otherOptions];
            const answerChoiceElements = questionContainer.querySelectorAll("input[type=radio]");
            answerChoiceElements.forEach((element, index) => {
                element.setAttribute("value", answerChoices[index]);
                element.nextElementSibling.textContent = answerChoices[index];
            });

            document.body.appendChild(questionContainer);
        }
        catch (e) {
            throw new Error(`Unable to display question and answer choices: ${e}`);
        }
    }
    
    createQuestionContainer() {
        const structure = document.createElement("div");
        structure.setAttribute("class", "question-container");
        structure.innerHTML = `
            <p class="question"></p>
            <div>
                <input type="radio" name="answer-choice" id="answer-choice-1" />
                <label for="answer-choice-1"></label>
            </div>
            <div>
                <input type="radio" name="answer-choice" id="answer-choice-2" />
                <label for="answer-choice-2"></label>
            </div>
            <div>
                <input type="radio" name="answer-choice" id="answer-choice-3" />
                <label for="answer-choice-3"></label>
            </div>
            <div>
                <input type="radio" name="answer-choice" id="answer-choice-4" />
                <label for="answer-choice-4"></label>
            </div>
            <button class="next-button" disabled>Next</button>
        `;
    
        structure.querySelector(".next-button").onclick = this.getAndDisplayQuestion;
        structure.querySelectorAll("input[type=radio]")
            .forEach(input => input.onchange = this.enableNextButton);

        return structure;
    };
}