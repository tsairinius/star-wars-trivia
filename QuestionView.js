import * as utils from "./utilities/utilities.js";
import { isWholeNumber } from "./utilities/NumberValidation.js";
import { isPercentage } from "./utilities/isPercentage.js";

export class QuestionView {
    constructor() {
        this.enableNextButton = () => {
            const next = document.querySelector(".next-button");
            next.disabled = false;
        };

        this.validateAnswerAndGetNextQuestion = null;
    };

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
    
        const quizContainer = document.querySelector(".quiz-container");
        quizContainer.appendChild(questionContainer);
    };

    getChosenAnswer() {
        const checkedElement = document.querySelector("input[name=answer-choice]:checked");
        return checkedElement ? checkedElement.value : null;
    }

    renderQuizComplete(numQuestionsCorrect, numQuestionsAsked) {
        const quizContainer = document.querySelector("div[class=quiz-container]");
        if (!this.isValidScore(numQuestionsCorrect, numQuestionsAsked)) {
            quizContainer.innerHTML = "Quiz completed!";
        }
        else {
            quizContainer.innerHTML = `You answered ${numQuestionsCorrect}/${numQuestionsAsked} questions correctly!`;
        }
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