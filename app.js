import { QuestionQueue } from "./QuestionQueue.js";
import * as birthYear from "./birthYear.js";

// const queue = new QuestionQueue();

export function displayNewQuestion(question) {
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

export function displayQuestionStructure() {
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

    document.body.appendChild(structure);
};

// displayQuestionStructure();
// const question = {
//     question: "What day is it?",
//     answer: "Monday",
//     otherOptions: ["Tuesday", "Wednesday", "Thursday"]
// };

// displayNewQuestion(question);


// const question = {
//     question: "What day is it?",
//     answer: "Monday",
//     otherOptions: ["Tuesday", "Wednesday", "Thursday"]
// };
// displayNewQuestion(question)

// const button = document.querySelector("button");
// button.onclick = function () {
//     const element = document.querySelector('p');
//     const question = queue.getQuestion();
//     element.textContent = question.question;
// }

// birthYear.createBirthYearQuestion().then(value => {
//     console.log("adding question 1: ", value.question)
//     queue.addQuestion(value);
//     displayNewQuestion();
// });

// birthYear.createBirthYearQuestion().then(value => {
//     console.log("adding question 2", value.question)
//     queue.addQuestion(value);
//     displayNewQuestion();
// });

// birthYear.createBirthYearQuestion().then(value => {
//     console.log("adding question 3", value.question)
//     queue.addQuestion(value);
//     displayNewQuestion();
// });

// (async () => console.log(await createBirthYearQuestion()))()
