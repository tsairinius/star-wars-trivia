export class QuestionQueue {
    constructor(maxQuestions) {
        this.queue = [];            
        this.questionsAdded = [];
        this.numQuestionsAdded = 0;
        this.maxQuestions = maxQuestions;
    }

    getNumQuestionsAdded() {
        return this.numQuestionsAdded;
    }

    getQuestion() {
        return (this.queue.length ? this.queue.pop() : null);
    };

    addQuestion(question) {
        if (this.numQuestionsAdded > this.maxQuestions) {
            console.error(`More than ${this.maxQuestions} questions have been added to queue`);
        };

        if (!this.shouldRejectQuestion(question)) {
            this.queue = [question, ...this.queue]; 
            this.questionsAdded = [question.question, ...this.questionsAdded];
            this.numQuestionsAdded++;
            return 0; 
        };

        return 1;
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
            const isDuplicate = this.questionsAdded.some(currQuestion => currQuestion === question.question);

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