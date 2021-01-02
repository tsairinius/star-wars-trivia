export class QuestionQueue {
    constructor() {
        this.queue = [];
        this.numQuestionsAdded = 0;
    }

    getNumQuestionsAdded() {
        return this.numQuestionsAdded;
    }

    getQuestion() {
        return (this.queue.length ? this.queue.pop() : null);
    };

    addQuestion(question) {
        if (this.numQuestionsAdded > 10) {
            console.error("More than 10 questions have been added to queue");
        };

        if (!this.shouldRejectQuestion(question)) {
            this.queue = [question, ...this.queue]; 
            this.numQuestionsAdded++;
            return 1; 
        };

        return 0;
    };

    shouldRejectQuestion(question) {
        const isInvalidQuestion = () => {
            const isInvalid = (
                !question || 
                (typeof question.question !== "string") ||
                !question.question || 
                !question.answer || 
                (typeof question.answer !== "string") ||
                (question.answer === "unknown") ||
                !question.otherOptions ||
                question.otherOptions.length !== 3 ||
                question.otherOptions.some(option => (!option || option === "unknown" || typeof option !== "string"))
            )

            if (isInvalid) {
                console.error(`Denied adding invalid question to question queue: ${question ? JSON.stringify(question) : question}`);
            };

            return isInvalid;
        };

        const isDuplicateQuestion = () => {
            const questions = this.queue.map(item => item.question);
            const isDuplicate = questions.some(currQuestion => currQuestion === question.question);

            if (isDuplicate) {
                console.error("No duplicate questions allowed in queue");
            };

            return isDuplicate;
        };

        const hasDuplicateAnswerChoice = () => {
            const answers = [question.answer, ...question.otherOptions];
            const hasDuplicate = answers.some((answer, index) => answers.indexOf(answer) !== index);

            if (hasDuplicate) {
                console.error(`There are duplicate answer choices for question: ${JSON.stringify(question)}`);
            };

            return hasDuplicate;
        };

        return (isInvalidQuestion() || isDuplicateQuestion() || hasDuplicateAnswerChoice());
    };
};