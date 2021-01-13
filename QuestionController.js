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
                console.log("Complete!");
            }
            else {
                this.questionView.displayQuestion(data.currentQuestion);
                this.questionView.updateScore(data.numQuestionsCorrect, data.numQuestionsAsked);
            }
        }

        this.questionModel.addSubscriber(this.handleModelChange);
        this.questionView.validateAnswerAndGetNextQuestion = this.validateAnswerAndGetNextQuestion;
    }
}