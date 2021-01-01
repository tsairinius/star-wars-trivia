export class QuestionQueue {
    constructor() {
        this.queue = [];
    }

    getQuestion() {
        return (this.queue.length ? this.queue.pop() : null);
    };

    addQuestion(question) {
        const isInvalidQuestion = (
            !question || 
            (typeof question.question !== "string") ||
            !question.question || 
            !question.answer || 
            (typeof question.answer !== "string") ||
            (question.answer === "unknown") ||
            !question.otherOptions ||
            question.otherOptions.length !== 3 ||
            question.otherOptions.some(option => (!option || option === "unknown" || typeof option !== "string"))
        );

        if (isInvalidQuestion) {
            console.error(`Denied adding invalid question to question queue: ${question ? JSON.stringify(question) : question}`);
        }
        else {
            this.queue = [question, ...this.queue];  
        }
    };
};