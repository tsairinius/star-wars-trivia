import * as utils from "./utilities/utilities.js";
import { isWholeNumber } from "./utilities/NumberValidation.js";
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

    clearQuizContainer() {
        const quizContainer = document.querySelector(".quiz-container");
        quizContainer.innerHTML = ``;
    }

    initializeView() {
        this.renderStartScreen();
        this.initializeAudioButtonBehavior();
    }

    initializeAudioButtonBehavior() {
        try {
            const audio = document.querySelector(".cantina-song");
            const audioButton = document.querySelector(".audio-control");
            audioButton.onclick = () => {
                if (this.isAudioPaused(audio)) {
                    audio.play();
                    audioButton.textContent = "Bartender, turn that noise off!";
                }
                else {
                    audio.pause();
                    audioButton.textContent = "Bartender, can you put on some tunes?";
                }
            }

            // audio.addEventListener("en")
        }
        catch (e) {
            console.error(`Unable to set onClick callback for audio button: ${e}`);
        }
    }

    isAudioPaused(audioElement) {
        return audioElement.paused;
    }

    renderStartScreen() {
        const quizContainer = document.querySelector(".quiz-container");
        const triviaButtonContainer = document.querySelector(".trivia-button");
        if (quizContainer && triviaButtonContainer) {
            quizContainer.innerHTML = `
                <h4>CHALMUN'S CANTINA PRESENTS</h2>
                <h2>STAR WARS CHARACTERS TRIVIA</h2>
                <h4>5 questions, ${TIME_PER_QUESTION_MS/1000} seconds for each</h4>
            `;

            triviaButtonContainer.innerHTML = `<button>Begin</button>`;
            triviaButtonContainer.firstElementChild.onclick = this.onBeginClick;
            this.onStartScreenRender();
        }
        else {
            throw new Error("Missing quiz container and/or button container to render in");
        }
    }

    renderScoreAndTime() {
        const quizContainer = document.querySelector(".quiz-container");
        if (quizContainer) {
            const statsContainer = document.createElement("div");
            statsContainer.className = "stats-container";
            statsContainer.innerHTML = `
                <div class="score-container">
                    <div class="score" data-testid="score"></div>
                </div>
                <div class="time-container">
                    <div class="time-in-seconds"></div>
                    <div class="time-bar" data-testid="time-bar"></div>
                </div>    
            `;

            quizContainer.append(statsContainer);
        }
        else {
            throw new Error("Missing quiz container to render in");
        }
    }

    renderQuizComplete(numQuestionsCorrect, numQuestionsAsked) {
        const quizContainer = document.querySelector("div[class=quiz-container]");
        const quizCompleteContainer = document.createElement("div");
        quizCompleteContainer.className = "quiz-complete-container";

        let quizCompleteMessage;
        if (!this.isValidScore(numQuestionsCorrect, numQuestionsAsked)) {
            quizCompleteMessage = "<h3>Quiz completed!</h3>";
        }
        else {
            quizCompleteMessage = 
            `<h2>You scored ${numQuestionsCorrect}/${numQuestionsAsked}!</h2>${this.getQuizCompleteMessage(numQuestionsCorrect, numQuestionsAsked)}`;
        }

        quizCompleteContainer.innerHTML = quizCompleteMessage;

        const triviaButtonContainer = document.querySelector(".trivia-button");
        triviaButtonContainer.innerHTML = `<button>Main</button>`;
        triviaButtonContainer.firstElementChild.onclick = this.onMainButtonClick;

        quizContainer.innerHTML = "";
        quizContainer.append(quizCompleteContainer);
    }

    getQuizCompleteMessage(numQuestionsCorrect, numQuestionsAsked) {
        const score = numQuestionsCorrect/numQuestionsAsked;
        let message;
        if (score < 0.2) {
            message = `
                <p>"Impressive. Every word in that sentence is wrong"</p>
                <p>- Luke Skywalker</p>
            `;
        }
        else if (score >= 0.2 && score < 0.4) {
            message = `
                <p>"Let\'s keep a little optimism here"</p>
                <p>- Han Solo</p>
            `; 
        }
        else if (score >= 0.4 && score < 0.6) {
            message = `
                <p>"Great kid. Don\'t get cocky"</p>
                <p>- Han Solo</p>
            `;
        }
        else if (score >= 0.6 && score < 0.8) {
            message = `
                <p>"The force is strong with this one"</p>
                <p>- Darth Vader</p>
            `;
        }
        else if (score >= 0.8 && score < 1) {
            message = `<p>Well I'll be a son of a bantha!</p>`;
        }
        else {
            message = `<p>Well done! You've earned yourself a free glass of blue milk on the house.</p>
                <img src="./blue-milk.png" class="blue-milk-image">`;
        }

        return message;
    };

    renderLoadingScreen() {
        if (document.querySelector(".question-container")) {
            document.querySelector(".question-container").remove();
        };

        const questionContainer = document.createElement("div");
        questionContainer.setAttribute("class", "question-container");

        const quizContainer = document.querySelector(".quiz-container");
        questionContainer.innerHTML = `<div class="loading-screen"><h2>Loading...</h2><p>(from a galaxy far far away)</p></div>`;
        if (quizContainer) {
            quizContainer.append(questionContainer);
        }
        else {
            throw new Error("Could not find quiz container to render in");
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
                `;
                    
                questionContainer.querySelectorAll("input[type=radio]")
                    .forEach(input => input.onchange = this.enableNextButton);
            
                const quizContainer = document.querySelector(".quiz-container");
                quizContainer.appendChild(questionContainer); 
                
                const triviaButtonContainer = document.querySelector(".trivia-button");
                triviaButtonContainer.innerHTML = `<button class="next-button" disabled>Next</button>`;
                triviaButtonContainer.firstElementChild.onclick = () => this.onNextClick(this.getChosenAnswer());
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

    updateTimeBar(timeLeftFraction) {
        if (typeof timeLeftFraction !== "number" || timeLeftFraction > 1 || timeLeftFraction < 0) {
            console.error(`Invalid arg. Must be a number between 0 and 1. Skipped updating time left on screen. Arg passed in: ${timeLeftFraction}`);
        }
        else {
            const timeBar = document.querySelector("div[class=time-bar]");
            if (!timeBar) {
                console.error(`Could not find time bar in DOM to update`);
            }
            else {
                timeBar.style.transform = `scaleX(${timeLeftFraction})`;
            }  
        }
    };

    updateTimeInSeconds(timeLeft) {
        if (!isWholeNumber(timeLeft)) {
            console.error(`Invalid arg: ${timeLeft}. Must pass in a whole number`)
        }
        else {
            const timeElement = document.querySelector("div[class=time-in-seconds]");
            if (!timeElement) {
                console.error(`Could not find time element in DOM to update`);
            }
            else {
                timeElement.textContent = `${timeLeft}`
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