import { TIME_PER_QUESTION_MS } from "./constants.js";

export class QuestionController {
    constructor(questionModel, questionView) {
        this.questionModel = questionModel;
        this.questionView = questionView;

        this.startQuiz = () => {
            this.questionView.clearQuizContainer();
            this.questionView.renderScoreAndTime();
            this.questionView.updateScore(this.questionModel.numQuestionsCorrect, this.questionModel.numQuestionsAsked);
            this.questionView.displayQuestion(this.questionModel.currentQuestion);
            if (this.questionModel.currentQuestion) {
                this.questionModel.setTimer();
            }
            this.questionModel.setIsQuizRunning(true);
            this.questionView.triggerDataPortAnimation();
        };

        this.resetQuiz = () => {
            this.questionModel.resetData();
            this.questionView.returnToStartScreen();
        };

        this.handleNextQuestion = (chosenAnswer) => {
            const isValid = this.questionModel.validateAnswerAndGetNextQuestion(chosenAnswer);
            this.questionView.triggerLightbulbAnimation(isValid);
            this.questionView.triggerDataPortAnimation();
        };

        this.handleModelChange = (data) => {
            if (!data) {
                throw new TypeError("Data argument is undefined");
            }

            this.questionModel.cancelTimer();
            if (data.quizComplete) {
                this.questionView.renderQuizComplete(data.numQuestionsCorrect, data.numQuestionsAsked);
                this.questionModel.setIsQuizRunning(false);
            }
            else {
                if (data.isQuizRunning) {
                    this.questionView.updateScore(data.numQuestionsCorrect, data.numQuestionsAsked);
                    this.questionView.displayQuestion(data.currentQuestion);
                    if (data.currentQuestion) {
                        this.questionModel.setTimer();
                    }
                }
            }
        }

        this.handleTimeChange = (timeLeft) => {
            if (typeof timeLeft === "number") {
                if (timeLeft <= 0) {
                    const chosenAnswer = this.questionView.getChosenAnswer();
                    this.handleNextQuestion(chosenAnswer);
                }
                else {
                    this.questionView.updateTimeBar(timeLeft/TIME_PER_QUESTION_MS);
                    this.questionView.updateTimeInSeconds(Math.ceil(timeLeft/1000));
                }
            }
            else {
                console.error(`Invalid argument passed as time left: ${timeLeft}. Must be of type Number`);
            }
        }

        this.questionModel.addSubscriber(this.handleModelChange);
        this.questionModel.onTimeChange = this.handleTimeChange;

        this.questionView.onNextClick = this.handleNextQuestion;
        this.questionView.onBeginClick = this.startQuiz;
        this.questionView.onStartScreenRender = this.questionModel.createQuestionSet;
        this.questionView.onMainButtonClick = this.resetQuiz;
    }
}