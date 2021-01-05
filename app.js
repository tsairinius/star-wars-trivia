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
                if (!document.querySelector(".question").textContent) {
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
            const questionElement = document.querySelector(".question");

            const answerChoices = [question.answer, ...question.otherOptions];
            questionElement.textContent = question.question;

            const answerChoiceElements = document.querySelectorAll("input[type=radio]");
            answerChoiceElements.forEach((element, index) => {
                element.setAttribute("value", answerChoices[index]);
                element.labels[0].textContent = answerChoices[index];
            });
        }
        catch (e) {
            throw new Error(`Unable to display question and answer choices: ${e}`);
        }
    }
    
    displayQuestionStructure() {
        const structure = document.createElement("div");
        structure.setAttribute("class", "question-container");
        structure.innerHTML = `
            <p class="question"></p>
            <input type="radio" name="answer-choice" id="answer-choice-1" />
            <label for="answer-choice-1"></label>
            <input type="radio" name="answer-choice" id="answer-choice-2" />
            <label for="answer-choice-2"></label>
            <input type="radio" name="answer-choice" id="answer-choice-3" />
            <label for="answer-choice-3"></label>
            <input type="radio" name="answer-choice" id="answer-choice-4" />
            <label for="answer-choice-4"></label>
            <button>Next</button>
        `;
    
        structure.querySelector("button").onclick = this.getAndDisplayQuestion;
        document.body.appendChild(structure);
    };
}

// const manager = new QuestionManager();
// manager.displayQuestionStructure();
// manager.createQuestionSet();
