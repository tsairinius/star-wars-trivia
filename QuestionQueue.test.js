import { QuestionQueue } from "./QuestionQueue.js";

describe("QuestionQueue", () => {
    const question = {
        question: "What day is it?",
        answer: "Monday",
        otherOptions: ["Tuesday", "Wednesday", "Thursday"]
    };

    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    let queue;
    beforeEach(() => {
        consoleErrorMock.mockClear();
        queue = new QuestionQueue();
    });

    test("Adding question to queue", () => {
        queue.addQuestion(question);
        expect(queue.queue.length).toBe(1);
        expect(queue.queue[0]).toEqual(question);
    });

    test("Getting question from queue returns valid object", () => {
        queue.addQuestion(question);
        const result = queue.getQuestion();
        expect(result.question).toBe(question.question);
        expect(result.answer).toBe(question.answer);
        expect(result.otherOptions).toEqual(question.otherOptions);
    });

    test("Queue does not add undefined questions", () => {
        consoleErrorMock.mockReturnValueOnce();
        queue.addQuestion(undefined);

        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Queue does not add questions with empty strings for question property", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "",
            answer: "Monday",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }

        queue.addQuestion(badQuestion);

        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Queue does not add questions with undefined question property", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: undefined,
            answer: "Monday",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }

        queue.addQuestion(badQuestion);

        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Queue does not add questions with empty strings for answer property", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }

        queue.addQuestion(badQuestion);

        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Queue does not add questions with 'unknown' as value for answer property", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "unknown",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }

        queue.addQuestion(badQuestion);

        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Queue does not add questions with undefined answer property", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: undefined,
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }

        queue.addQuestion(badQuestion);

        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Queue does not add questions missing three other choices as answers", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: ["Wednesday", "Thursday"]
        }

        queue.addQuestion(badQuestion);

        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Queue does not add questions with empty string in other answer choices", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: ["", "Wednesday", "Thursday"]
        }

        queue.addQuestion(badQuestion);

        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Queue does not add questions with undefined in other answer choices", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: [undefined, "Wednesday", "Thursday"]
        }

        queue.addQuestion(badQuestion);

        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
});