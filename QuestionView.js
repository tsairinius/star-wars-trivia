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

    renderStartScreen() {
        const triviaScreen = document.querySelector(".trivia-screen");
        if (triviaScreen) {
            triviaScreen.innerHTML = `
                <h3>Do you know your Star Wars characters?</h3>
                <h4>5 questions, ${TIME_PER_QUESTION_MS/1000} seconds for each</h4>
                <div class="trivia-button">
                    <button>Begin</button>
                </div>
            `;
        
            triviaScreen.querySelector("button").onclick = this.onBeginClick;
            this.onStartScreenRender();
        }
        else {
            throw new Error("Missing trivia container to render in");
        }
    }

    renderScoreAndTimeBar() {
        const triviaScreen = document.querySelector(".trivia-screen");
        if (triviaScreen) {
            triviaScreen.innerHTML = `
                <div class="stats-container">
                    <div class="score" data-testid="score"></div>
                    <div class="time-bar" data-testid="time-bar"></div>
                </div>
            `;
        }
        else {
            throw new Error("Missing trivia container to render in");
        }
    }

    renderQuizComplete(numQuestionsCorrect, numQuestionsAsked) {
        const triviaScreen = document.querySelector("div[class=trivia-screen]");
        const quizCompleteContainer = document.createElement("div");

        let quizCompleteMessage;
        if (!this.isValidScore(numQuestionsCorrect, numQuestionsAsked)) {
            quizCompleteMessage = "<p>Quiz completed!<p>";
        }
        else {
            quizCompleteMessage = 
            `
                <p>You scored ${numQuestionsCorrect}/${numQuestionsAsked}!<p>
                <p>${this.getQuizCompleteMessage(numQuestionsCorrect, numQuestionsAsked)}<p>
            `;
        }

        quizCompleteContainer.innerHTML = 
            `
                ${quizCompleteMessage}
                <div class="trivia-button">
                    <button>Main</button>
                </div>
            `;

        const mainMenuButton = quizCompleteContainer.querySelector(".trivia-button button");
        mainMenuButton.onclick = this.onMainButtonClick;

        triviaScreen.innerHTML = "";
        triviaScreen.append(quizCompleteContainer);
    }

    getQuizCompleteMessage(numQuestionsCorrect, numQuestionsAsked) {
        const score = numQuestionsCorrect/numQuestionsAsked;
        let message;
        if (score < 0.2) {
            message = '"Impressive. Every word in that sentence is wrong"';
        }
        else if (score >= 0.2 && score < 0.4) {
            message = '"Let\'s keep a little optimism here"'; 
        }
        else if (score >= 0.4 && score < 0.6) {
            message = '"Great kid. Don\'t get cocky"';
        }
        else if (score >= 0.6 && score < 0.8) {
            message = '"The force is strong with this one"';
        }
        else if (score >= 0.8 && score < 1) {
            message = "Well I'll be a son of a bantha!";
        }
        else {
            message = "Well done! You've earned yourself a free glass of blue milk on the house.";
        }

        return message;
    };

    // I find your lack of competence disturbing
    // Have you been living under a rock on Dagobah? 
    // You make those bucketheads look smart! 
    // Well I'll be a son of a Bantha! 
    // Well done! You've earned yourself 
    // The force is strong with this one! 
    // A wookie could do better!

    renderLoadingScreen() {
        if (document.querySelector(".question-container")) {
            document.querySelector(".question-container").remove();
        };

        const questionContainer = document.createElement("div");
        questionContainer.setAttribute("class", "question-container");

        const triviaScreen = document.querySelector(".trivia-screen");
        questionContainer.textContent = "Loading...";
        if (triviaScreen) {
            triviaScreen.append(questionContainer);
        }
        else {
            throw new Error("Could not find trivia container to render in");
        }
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
        if (question === undefined) {
            throw new Error("Missing question as argument");
        }
        else {
            if (question === null) {
                this.renderLoadingScreen();
            }
            else {
                if (document.querySelector(".question-container")) {
                    document.querySelector(".question-container").remove();
                };

                const answerChoices = utils.randomizeArray([question.answer, ...question.otherOptions]);
        
                const questionContainer = document.createElement("div");
                questionContainer.setAttribute("class", "question-container");
                questionContainer.innerHTML = `
                    <p class="question">${question.question}</p>
                    <div class="answer-choice-container">
                        <div>
                            <label class="answer-choice">
                                <span class="answer-choice-input"> 
                                    <input data-testid="answer-choice-1" type="radio" name="answer-choice" id="answer-choice-1" value=${answerChoices[0]} />
                                    <span class="answer-choice-control"></span>
                                </span>
                                <span class="answer-choice-label">${answerChoices[0]}</span>
                            </label>
                        </div>
                        <div>
                            <label class="answer-choice">
                                <span class="answer-choice-input"> 
                                    <input data-testid="answer-choice-2" type="radio" name="answer-choice" id="answer-choice-2" value=${answerChoices[1]} />
                                    <span class="answer-choice-control"></span>
                                </span>
                                <span class="answer-choice-label">${answerChoices[1]}</span>
                            </label>
                        </div>
                        <div>
                            <label class="answer-choice">
                                <span class="answer-choice-input"> 
                                    <input data-testid="answer-choice-3" type="radio" name="answer-choice" id="answer-choice-3" value=${answerChoices[2]} />
                                    <span class="answer-choice-control"></span>
                                </span>
                                <span class="answer-choice-label">${answerChoices[2]}</span>
                            </label>
                        </div>
                        <div>
                            <label class="answer-choice">
                                <span class="answer-choice-input"> 
                                    <input data-testid="answer-choice-4" type="radio" name="answer-choice" id="answer-choice-4" value=${answerChoices[3]} />
                                    <span class="answer-choice-control"></span>
                                </span>
                                <span class="answer-choice-label">${answerChoices[3]}</span>
                            </label>
                        </div>
                    </div>
                    <div class="trivia-button">
                        <button class="next-button" disabled>Next</button>
                    </div>
                `;
            
                questionContainer.querySelector(".next-button").onclick = () => {
                    this.onNextClick(this.getChosenAnswer());
                }
                    
                questionContainer.querySelectorAll("input[type=radio]")
                    .forEach(input => input.onchange = this.enableNextButton);
            
                const triviaScreen = document.querySelector(".trivia-screen");
                triviaScreen.appendChild(questionContainer);
            }
        }       
    };

    triggerDataPortAnimation() {
        const dataPort = document.querySelector(".data-port");
        if (dataPort.classList.contains("data-port__rotate")) {
            dataPort.classList.remove("data-port__rotate");
        }

        setTimeout(() => {
            dataPort.classList.add("data-port__rotate");
        }, 100);
    }

    triggerLightbulbAnimation(isValid) {
        const correctLight = document.querySelector(".lightbulb__correct");
        const incorrectLight = document.querySelector(".lightbulb__incorrect");

        this.deactivateActiveLightbulbs([correctLight, incorrectLight]);

        let lightbulbToActivate;
        if (isValid) {
            lightbulbToActivate = correctLight;
        }
        else {
            lightbulbToActivate = incorrectLight;
        }

        setTimeout(() => {
            lightbulbToActivate.classList.add("lightbulb__active");
        }, 100);
    }

    deactivateActiveLightbulbs(lightbulbs) {
        lightbulbs.forEach(lightbulb => {
            if (lightbulb.classList.contains("lightbulb__active")) {
                lightbulb.classList.remove("lightbulb__active");
            }
        });
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