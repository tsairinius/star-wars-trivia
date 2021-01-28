export function createOtherAnswerChoices(correctAnswer, createChoice) {
    if (!correctAnswer || !createChoice || typeof createChoice !== "function") {
        throw Error("Must pass in two arguments: the correct answer to compare against and a function for creating answer choices");
    }

    let choiceArray = [];
    for (let i = 0; i < 3; i++) {
        let newChoice;
        do {
            newChoice = createChoice();
        }
        while (choiceArray.some(choice => choice === newChoice) || (correctAnswer === newChoice))

        choiceArray = [...choiceArray, newChoice];
    }

    return choiceArray;
};

