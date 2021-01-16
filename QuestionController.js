export class QuestionController {
    constructor(questionModel, questionView) {
        this.questionModel = questionModel;
        this.questionView = questionView;

        this.validateAnswerAndGetNextQuestion = (chosenAnswer) => {
            this.questionModel.validateAnswerAndGetNextQuestion(chosenAnswer);
        };

        this.handleModelChange = (data) => {
            if (!data) {
                throw new TypeError("Data argument is undefined");
            }

            if (data.quizComplete) {
                this.questionView.renderQuizComplete(data.numQuestionsCorrect, data.numQuestionsAsked);
            }
            else {
                this.questionView.displayQuestion(data.currentQuestion);
                this.questionView.updateScore(data.numQuestionsCorrect, data.numQuestionsAsked);
                this.questionModel.setTimer();
            }
        }

        this.handleTimeChange = (timeLeft) => {
            if (timeLeft <= 0) {
                const chosenAnswer = this.questionView.getChosenAnswer();
                this.validateAnswerAndGetNextQuestion(chosenAnswer);
            }
            else {
                this.questionView.renderTimeBar(timeLeft);
            }
        }

        this.questionModel.addSubscriber(this.handleModelChange);
        this.questionView.validateAnswerAndGetNextQuestion = this.validateAnswerAndGetNextQuestion;
        this.questionModel.onTimeChange = this.handleTimeChange;
    }
}