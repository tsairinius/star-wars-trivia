import { QuestionQueue } from "./QuestionQueue.js";
import * as birthYear from "./birthYear.js";

export class QuestionManager {

    constructor() {
        this.queue = new QuestionQueue();

        this.getAndDisplayQuestion = () => {
            const question = this.queue.getQuestion();
            this.displayQuestion(question);
        };
    }

    createQuestions() {
        birthYear.createBirthYearQuestion().then(question => {
            this.queue.addQuestion(question);
            if (!document.querySelector(".question").textContent) {
                this.getAndDisplayQuestion(question);
            };
        });

        birthYear.createBirthYearQuestion().then(question => {
            this.queue.addQuestion(question);
            if (!document.querySelector(".question").textContent) {
                this.getAndDisplayQuestion(question);
            };
        });

        birthYear.createBirthYearQuestion().then(question => {
            this.queue.addQuestion(question);
            if (!document.querySelector(".question").textContent) {
                this.getAndDisplayQuestion(question);
            };
        });
    };

    displayQuestion(question) {
        const questionElement = document.querySelector(".question");
        if (!question) {
            throw new Error("Missing question as argument");
        }
        
        try {
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
// manager.createQuestions();
