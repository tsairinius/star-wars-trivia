import { QuestionQueue } from "./QuestionQueue.js";
import { createRandomQuestion } from "./utilities/createRandomQuestion.js";
import { TIME_PER_QUESTION_MS } from "./constants.js";

export class QuestionModel {
    constructor(maxQuestions = 5) {
        this.queue = new QuestionQueue(maxQuestions);
        this.subscribers = [];

        this.currentQuestion = null;

        this.maxQuestions = maxQuestions;
        this.numQuestionsAsked = 0;
        this.numQuestionsCorrect = 0;
        this.quizComplete = false;
        this.timeLeft = TIME_PER_QUESTION_MS; 
        this.prevTime = null;

        this.onTimeChange = null;

        this.validateAnswerAndGetNextQuestion = (chosenAnswer) => {
            if (chosenAnswer === this.currentQuestion.answer) {
                this.numQuestionsCorrect++;
                console.assert(this.numQuestionsCorrect <= this.numQuestionsAsked, "Number of questions answered correctly is greater than the total number asked");
            }

            if ((this.getNextQuestion() === 1) && this.numQuestionsAsked === this.maxQuestions) {
                this.quizComplete = true;
            };

            this.callSubscribers();
        };

        this.getTimeLeft = (timestamp) => {
            let timeElapsed;
            if (this.prevTime) {
                timeElapsed = timestamp - this.prevTime;
            }
            else {
                timeElapsed = 0;
            }
    
            this.timeLeft = this.timeLeft - timeElapsed;
            this.prevTime = timestamp;
    
            this.onTimeChange(100*this.timeLeft/TIME_PER_QUESTION_MS);
    
            if (this.timeLeft >= 0) {
                requestAnimationFrame(this.getTimeLeft);
            }
        }
    }

    addSubscriber(subscriber) {
        if (typeof subscriber !== "function") {
            throw new TypeError("A function was not passed in as an argument");
        }

        this.subscribers = [...this.subscribers, subscriber];
    }

    callSubscribers() {
        const data = {
            currentQuestion: {
                ...this.currentQuestion,
                otherOptions: [...this.currentQuestion.otherOptions]
            },
            numQuestionsCorrect: this.numQuestionsCorrect,
            numQuestionsAsked: this.numQuestionsAsked,
            quizComplete: this.quizComplete
        };
    
        this.subscribers.forEach(subscriber => subscriber(data));
    };

    setTimer() {
        this.timeLeft = TIME_PER_QUESTION_MS;
        requestAnimationFrame(this.getTimeLeft);
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

            const question = await createRandomQuestion();
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
}