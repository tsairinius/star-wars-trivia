export const question = Object.freeze({
    question: "What day is it?",
    answer: "Monday",
    otherOptions: Object.freeze(["Tuesday", "Wednesday", "Thursday"])
});

export const secondQuestion = Object.freeze({
    question: "What color is the sky?",
    answer: "blue",
    otherOptions: Object.freeze(["yellow", "red", "green"])
});

export const fakeQuestions = [
    Object.freeze({
        question: "What day is it?",
        answer: "Monday",
        otherOptions: Object.freeze(["Tuesday", "Wednesday", "Thursday"])
    }),
    Object.freeze({
        question: "What color is the sky?",
        answer: "blue",
        otherOptions: Object.freeze(["yellow", "red", "green"])
    }), 
    Object.freeze({
        question: "What is the capitol of California?",
        answer: "Sacramento",
        otherOptions: Object.freeze(["Houston", "San Francisco", "Denver"])
    }), 
    Object.freeze({
        question: "Who is the first U.S president?",
        answer: "George Washington",
        otherOptions: Object.freeze(["Thomas Jefferson", "Benjamin Franklin", "Barack Obama"])
    }), 
    Object.freeze({
        question: "Who is C3PO's best friend?",
        answer: "R2-D2",
        otherOptioners: Object.freeze(["Han Solo", "Leia Organa", "Luke Skywalker"])
    })
]