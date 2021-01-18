import { QuestionView } from "./QuestionView.js";
import { QuestionModel } from "./QuestionModel.js";
import { QuestionController } from "./QuestionController.js";


export function initializeQuizContainer() {
    const quizContainer = document.createElement("div");
    quizContainer.className = "quiz-container";
    quizContainer.innerHTML = `
        <div class="score" data-testid="score">0/0</div>
        <div class="time-bar"></div>
    `;

    document.body.append(quizContainer);
}

initializeQuizContainer();
const questionModel = new QuestionModel();
const questionView = new QuestionView();
const questionController = new QuestionController(questionModel, questionView);

questionModel.createQuestionSet();

// fetch("https://swapi.py4e.com/api/species").then(response => response.json()).then(json => json.results.forEach(item => console.log(item.name)))
// fetch("https://swapi.py4e.com/api/species/?page=2").then(response => response.json()).then(json => json.results.forEach(item => console.log(item.name)))
// fetch("https://swapi.py4e.com/api/species/?page=3").then(response => response.json()).then(json => json.results.forEach(item => console.log(item.name)))
// fetch("https://swapi.py4e.com/api/species/?page=4").then(response => response.json()).then(json => json.results.forEach(item => console.log(item.name)))
// fetch("https://swapi.py4e.com/api/species/?page=5").then(response => response.json()).then(json => json.results.forEach(item => console.log(item.name)))
// fetch("https://swapi.py4e.com/api/species/?page=6").then(response => response.json()).then(json => json.results.forEach(item => console.log(item.name)))
// fetch("https://swapi.py4e.com/api/species/?page=7").then(response => response.json()).then(json => json.results.forEach(item => console.log(item.name)))


// fetch("https://swapi.py4e.com/api/people").then(response => response.json()).then(json => json.results.forEach(person => {if (person.species.length < 1) {console.log(person)}}));
// fetch("https://swapi.py4e.com/api/people/?page=2").then(response => response.json()).then(json => json.results.forEach(person => {if (person.species.length < 1) {console.log(person)}}));
// fetch("https://swapi.py4e.com/api/people/?page=3").then(response => response.json()).then(json => json.results.forEach(person => {if (person.species.length < 1) {console.log(person)}}));
// fetch("https://swapi.py4e.com/api/people/?page=4").then(response => response.json()).then(json => json.results.forEach(person => {if (person.species.length < 1) {console.log(person)}}));
// fetch("https://swapi.py4e.com/api/people/?page=5").then(response => response.json()).then(json => json.results.forEach(person => {if (person.species.length < 1) {console.log(person)}}));
// fetch("https://swapi.py4e.com/api/people/?page=6").then(response => response.json()).then(json => json.results.forEach(person => {if (person.species.length < 1) {console.log(person)}}));
// fetch("https://swapi.py4e.com/api/people/?page=7").then(response => response.json()).then(json => json.results.forEach(person => {if (person.species.length < 1) {console.log(person)}}));
// fetch("https://swapi.py4e.com/api/people/?page=8").then(response => response.json()).then(json => json.results.forEach(person => {if (person.species.length < 1) {console.log(person)}}));
// fetch("https://swapi.py4e.com/api/people/?page=9").then(response => response.json()).then(json => json.results.forEach(person => {if (person.species.length < 1) {console.log(person)}}));


// fetch("https://swapi.py4e.com/api/species").then(response => response.json()).then(json => console.log(json))


// (async () => console.log(await createSpeciesQuestion()))()


// fetch("https://swapi.py4e.com/api/species").then(response => response.json()).then(json => console.log(json))
