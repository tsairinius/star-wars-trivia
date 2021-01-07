export function createOtherAnswerChoices(createChoice) {
    if (!createChoice || typeof createChoice !== "function") {
        throw Error("Must pass in a function");
    }

    let choiceArray = [];
    for (let i = 0; i < 3; i++) {
        let newChoice;
        do {
            newChoice = createChoice();
        }
        while (choiceArray.some(choice => choice === newChoice))

        choiceArray = [...choiceArray, newChoice];
    }

    return choiceArray;
};

