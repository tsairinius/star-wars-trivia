import * as utils from "./utilities/utilities.js";
import { isWholeNumber } from "./utilities/NumberValidation.js";
import { isPercentage } from "./utilities/isPercentage.js";
import { TIME_PER_QUESTION_MS } from "./constants.js";

export class QuestionView {
    constructor() {
        this.enableNextButton = () => {
            const next = document.querySelector(".next-button");
            next.disabled = false;
        };

        this.validateAnswerAndGetNextQuestion = null;
        this.onBeginClick = null;
        this.onMainButtonClick = null;
        this.onStartScreenRender = null;
    };

    initializeTriviaContainer() {
        const triviaContainer = document.createElement("div");
        triviaContainer.className = "trivia-container";
        document.body.append(triviaContainer);
    }

    renderStartScreen() {
        const triviaContainer = document.querySelector(".trivia-container");
        if (triviaContainer) {
            triviaContainer.innerHTML = `
                <h3>Do you know your Star Wars characters?</h3>
                <h4>5 questions, ${TIME_PER_QUESTION_MS/1000} seconds for each</h4>
                <button>Begin</button>
            `;
        
            triviaContainer.querySelector("button").onclick = this.onBeginClick;
            this.onStartScreenRender();
        }
        else {
            throw new Error("Missing trivia container to render in");
        }
    }

    renderScoreAndTimeBar() {
        const triviaContainer = document.querySelector(".trivia-container");
        if (triviaContainer) {
            triviaContainer.innerHTML = `
                <div class="score" data-testid="score">0/0</div>
                <div class="time-bar" data-testid="time-bar"></div>
            `;
        }
        else {
            throw new Error("Missing trivia container to render in");
        }
    }

    renderQuizComplete(numQuestionsCorrect, numQuestionsAsked) {
        const triviaContainer = document.querySelector("div[class=trivia-container]");
        const quizCompleteFragment = document.createDocumentFragment();
        if (!this.isValidScore(numQuestionsCorrect, numQuestionsAsked)) {
            quizCompleteFragment.textContent = "Quiz completed!";
        }
        else {
            quizCompleteFragment.textContent = `You answered ${numQuestionsCorrect}/${numQuestionsAsked} questions correctly!`;
        }

        const mainMenuButton = document.createElement("button");
        mainMenuButton.onclick = this.onMainButtonClick;
        mainMenuButton.textContent = "Main";
        quizCompleteFragment.append(mainMenuButton);

        triviaContainer.innerHTML = "";
        triviaContainer.append(quizCompleteFragment);
    }

    updateScore(numQuestionsCorrect, numQuestionsAsked) {
        const scoreElement = document.querySelector(".score");
        if (!this.isValidScore(numQuestionsCorrect, numQuestionsAsked)) {
            scoreElement.textContent = "Score unavailable";
        }
        else {
            scoreElement.textContent = `${numQuestionsCorrect}/${numQuestionsAsked}`;
        }
    }

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
    
        questionContainer.querySelector(".next-button").onclick = () => {
            this.validateAnswerAndGetNextQuestion(this.getChosenAnswer());
        }
            
        questionContainer.querySelectorAll("input[type=radio]")
            .forEach(input => input.onchange = this.enableNextButton);
    
        const triviaContainer = document.querySelector(".trivia-container");
        triviaContainer.appendChild(questionContainer);
    };

    getChosenAnswer() {
        const checkedElement = document.querySelector("input[name=answer-choice]:checked");
        return checkedElement ? checkedElement.value : null;
    }

    updateTimeBar(timeLeftPct) {
        if (!isPercentage(timeLeftPct)) {
            console.error(`Invalid arg. Skipped updating time left on screen. Percentage passed in: ${timeLeftPct}`);
        }
        else {
            const timeBar = document.querySelector("div[class=time-bar]");
            if (!timeBar) {
                console.error(`Could not find time bar in DOM to update`);
            }
            else {
                timeBar.style.width = `${timeLeftPct}%`; 
            }  
        }
    };

    isValidScore(numQuestionsCorrect, numQuestionsAsked) {
        let isValid = false;
        if (!isWholeNumber(numQuestionsCorrect) || !isWholeNumber(numQuestionsAsked)) {
            console.error(`Invalid score. The number of questions asked and the number correct must be of type Number. Args: ${numQuestionsCorrect}, ${numQuestionsAsked}`);
        }
        else if (numQuestionsCorrect > numQuestionsAsked) {
            console.error(`Invalid score. Number of questions correct is greater than number of questions asked: Number correct: ${numQuestionsCorrect}, Number asked: ${numQuestionsAsked}`);
        }
        else {
            isValid = true;
        }

        return isValid;
    }
}