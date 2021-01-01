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
        else if (this.isDuplicateQuestion(question.question)) {
            console.error("No duplicate questions allowed in queue");
        }
        else {
            this.queue = [question, ...this.queue];  
        }
    };

    isDuplicateQuestion(question) {
        if (!question || typeof question !== "string") {
            throw new TypeError("The argument 'question' of type string is required");
        }

        const questions = this.queue.map(item => item.question);
        return questions.some(currQuestion => currQuestion === question);
    };
};