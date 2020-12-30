import { QuestionQueue } from "./QuestionQueue.js";
import * as birthYear from "./birthYear.js";

// const queue = new QuestionQueue();

export function displayNewQuestion(question) {
    const element = document.querySelector('p');
    if (!element.textContent) {
        element.textContent = question.question;
    }
}
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
