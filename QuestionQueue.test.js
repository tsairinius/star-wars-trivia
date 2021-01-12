import { QuestionQueue } from "./QuestionQueue.js";

const question = Object.freeze({
    question: "What day is it?",
    answer: "Monday",
    otherOptions: ["Tuesday", "Wednesday", "Thursday"]
});

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
        expect(queue.addQuestion(question)).toBe(0);
        expect(queue.queue.length).toBe(1);
        expect(queue.queue[0]).toEqual(question);
    });
    
    test("Check that question validation is being called. Questions with empty string for question property is invalid", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "",
            answer: "Monday",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }
    
        expect(queue.addQuestion(badQuestion)).toBe(1);
    
        expect(queue.queue.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    test("Double check question validation is being called. Queue does not add duplicate questions", () => {
        consoleErrorMock.mockReturnValueOnce();
        const duplicate = { ...question };
        queue.addQuestion(question);

        expect(queue.addQuestion(duplicate)).toBe(1);
        expect(queue.queue.length).toBe(1);
        expect(consoleErrorMock).toHaveBeenCalledWith("No duplicate questions allowed in queue");
    });
});

describe("getNumQuestionsAdded", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    test("Returns accurate total number of questions added to queue", () => {
        const queue = new QuestionQueue();

        expect(queue.getNumQuestionsAdded()).toBe(0);
        queue.addQuestion(question);
        expect(queue.getNumQuestionsAdded()).toBe(1);
    });
});

describe("shouldRejectQuestion", () => {
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

    test("Returns false if all answer choices are unique", () => {
        expect(queue.shouldRejectQuestion(question)).toBe(false);
    });

    test("Returns true if a duplicate choice exists as an answer", () => {
        consoleErrorMock.mockReturnValue();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: ["Tuesday", "Wednesday", "Tuesday"]
        };

        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
    });

    test("Returns false if question passed in is unique to questions in queue", () => {
        queue.addQuestion(question);
        const uniqueQuestion = {
            question: "What color is the sky?",
            answer: "blue",
            otherOptions: ["yellow", "pink", "orange"]
        };

        expect(queue.shouldRejectQuestion(uniqueQuestion)).toBe(false);
    });

    test("Returns true if question passed in is a duplicate", () => {
        consoleErrorMock.mockReturnValue();
        queue.addQuestion(question);
        const duplicate = { ...question };
        expect(queue.shouldRejectQuestion(duplicate)).toBe(true);
    });

    test("Question is considered duplicate if it's a dupe of a question removed from queue", () => {
        consoleErrorMock.mockReturnValue();
        queue.addQuestion(question);
        queue.getQuestion();
        const duplicate = { ...question };

        expect(queue.queue.length).toBe(0);
        expect(queue.shouldRejectQuestion(duplicate)).toBe(true);
    });

    test("Returns true if question is undefined", () => {
        consoleErrorMock.mockReturnValueOnce();
        expect(queue.shouldRejectQuestion(undefined)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if question property of argument is an empty string", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "",
            answer: "Monday",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if question property of argument is undefined", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: undefined,
            answer: "Monday",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if question property is not a string", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: 437,
            answer: "Monday",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if answer property of argument is an empty string", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if answer property is 'unknown", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "unknown",
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if answer property is undefined", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: undefined,
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if answer property is not a string", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: 123,
            otherOptions: ["Tuesday", "Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if array of other answer choices is undefined", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: undefined
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if argument does not provide exactly three other answer choices", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: ["Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if one of the other answer choices is an empty string", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: ["", "Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if one of the other answer choices is undefined", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: [undefined, "Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
    
    test("Returns true if one of the other answer choices is 'unknown'", () => {
        consoleErrorMock.mockReturnValueOnce();
        const badQuestion = {
            question: "What day is it?",
            answer: "Monday",
            otherOptions: ["unknown", "Wednesday", "Thursday"]
        }
    
        expect(queue.shouldRejectQuestion(badQuestion)).toBe(true);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
});

