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
            !question.question || 
            !question.answer || 
            (question.answer === "unknown") ||
            question.otherOptions.length !== 3 ||
            question.otherOptions.some(option => (!option || typeof option !== "string"))
        );

        if (isInvalidQuestion) {
            console.error(`Denied adding invalid question to question queue: ${question ? JSON.stringify(question) : question}`);
        }
        else {
            this.queue = [question, ...this.queue];  
        }
    };
};