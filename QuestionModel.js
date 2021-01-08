import { QuestionQueue } from "./QuestionQueue.js";
import * as utils from "./utilities/utilities.js";

export class QuestionModel {
    constructor(maxQuestions = 10) {
        this.queue = new QuestionQueue(maxQuestions);
        this.subscribers = [];

        this.currentQuestion = null;

        this.maxQuestions = maxQuestions;
        this.numQuestionsAsked = 0;
        this.numQuestionsCorrect = 0;

        this.validateAnswerAndGetNextQuestion = () => {
            this.validateAnswer();
            this.getNextQuestion() === 0
            this.callSubscribers();
        };
    }

    addSubscriber(subscriber) {
        this.subscribers = [...this.subscribers, subscriber];
    }

    callSubscribers() {
        const data = {
            currentQuestion: {
                    ...this.currentQuestion, 
                    otherOptions: [...this.currentQuestion.otherOptions]
            },
            numQuestionsCorrect: this.numQuestionsCorrect,
            numQuestionsAsked: this.numQuestionsAsked
        };

        this.subscribers.forEach(subscriber => subscriber(data));
    };

    createQuestionSet() {
        for (let i = 0; i < this.maxQuestions; i++) {
            this.createQuestion();
        }
    };

    async createQuestion() {
        for (let i = 0; i < 10; i++) {
            if (this.queue.getNumQuestionsAdded() >= this.maxQuestions) {
                return 0;
            };

            const question = await utils.createRandomQuestion();
            const result = this.queue.addQuestion(question);

            if (result === 0) {
                if (!this.currentQuestion) {
                    if (this.getNextQuestion() === 0) {
                        this.callSubscribers();
                    };
                };
                return 0;
            }
        };

        return 1;
    };

    getNextQuestion() {
        const question = this.queue.getQuestion();
        if (question) {
            this.currentQuestion = question;
            this.numQuestionsAsked++;
            return 0;
        }
        else {
            console.error("Could not get a question from queue to display");
            return 1;
        }
    };

    validateAnswer() {
        const chosenAnswer = document.querySelector("input[name=answer-choice]:checked").value;
        if (chosenAnswer === this.currentQuestion.answer) {
            this.numQuestionsCorrect++;
        }
    };
    
}