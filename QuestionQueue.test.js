import { QuestionQueue } from "./QuestionQueue.js";

const question = {
    question: "What day is it?",
    answer: "Monday",
    otherOptions: ["Tuesday", "Wednesday", "Thursday"]
};

describe("getQuestion", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    let queue;
    beforeEach(() => {
        queue = new QuestionQueue();
    });

    test("Getting question from queue returns valid object", () => {
        queue.addQuestion(question);
        const result = queue.getQuestion();
        expect(result.question).toBe(question.question);
        expect(result.answer).toBe(question.answer);
        expect(result.otherOptions).toEqual(question.otherOptions);
    });

    test("If requesting question from empty queue, queue returns null", () => {
        expect(queue.getQuestion()).toBeNull();
    });
});

describe("addQuestion", () => {
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

    test("Successfully add question to queue", () => {
        queue.addQuestion(question);
        expect(queue.queue.length).toBe(1);
        expect(queue.queue[0]).toEqual(question);
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
    
    test("Queue does not add questions with question property that is not a string", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: 437,
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
    
    test("Queue does not add questions with answer property that is not a string", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: 123,
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }
    
        queue.addQuestion(badQuestion);
    
        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Queue does not add questions that have no other answer choices defined", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: undefined
        }
    
        queue.addQuestion(badQuestion);
    
        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Queue does not add questions that do not have exactly three other choices as answers", () => {
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
    
    test("Queue does not add questions with 'unknown' in other answer choices", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: ["unknown", "Wednesday", "Thursday"]
        }
    
        queue.addQuestion(badQuestion);
    
        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Queue does not add duplicate questions", () => {
        consoleErrorMock.mockReturnValueOnce();
        const duplicate = { ...question };
        queue.addQuestion(question);
        queue.addQuestion(duplicate);

        expect(queue.queue.length).toBe(1);
        expect(consoleErrorMock).toHaveBeenCalledWith("No duplicate questions allowed in queue");
    });
});

describe("isDuplicateQuestion", () => {
    let queue;
    beforeEach(() => {
        queue = new QuestionQueue();
        queue.addQuestion(question);
    });

    test("Returns false if question passed in is unique to questions in queue", () => {
        const uniqueQuestion = "What color is the sky?";
        expect(queue.isDuplicateQuestion(uniqueQuestion)).toBe(false);
    });

    test("Returns true if question passed in is a duplicate", () => {
        const duplicate = question.question;
        expect(queue.isDuplicateQuestion(duplicate)).toBe(true);
    });

    test("Throws error if argument passed in is not of type string", () => {
        expect(() => queue.isDuplicateQuestion(1)).toThrow("The argument 'question' of type string is required");
    });

    test("Throws error if argument is undefined", () => {
        expect(() => queue.isDuplicateQuestion()).toThrow("The argument 'question' of type string is required");
    }); 
});

