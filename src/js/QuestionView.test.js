import { QuestionView } from "./QuestionView.js";
import { queryByTestId, screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { question } from "./fakeQuestions.js";
import { cleanUpDOM } from "./utilities/cleanUpDOM.js";
import { TIME_PER_QUESTION_MS } from "./constants.js";
import { initializeDOM } from "./utilities/initializeDOM.js";

describe("renderStartScreen", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
        initializeDOM();
    });

    test("Shows intro text and begin button", () => {
        const view = new QuestionView();

        view.renderStartScreen();

        expect(screen.getByText("CHALMUN'S CANTINA PRESENTS")).toBeInTheDocument();
        expect(screen.getByText("STAR WARS CHARACTERS TRIVIA")).toBeInTheDocument();
        expect(screen.getByText(`5 questions, ${TIME_PER_QUESTION_MS/1000} seconds for each`)).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Begin"}));
    });

    test("Clicking Begin invokes function to initiate quiz", () => {
        const view = new QuestionView();
        view.onBeginClick = jest.fn();

        view.renderStartScreen();

        userEvent.click(screen.getByRole("button", {name: "Begin"}));

        expect(view.onBeginClick).toHaveBeenCalledTimes(1);
    });

    test("Throws error if there's no trivia container to render start screen in", () => {
        cleanUpDOM();
        const view = new QuestionView();

        expect(() => view.renderStartScreen()).toThrow(new Error("Missing quiz container and/or button container to render in"));
    });
});

describe("renderScoreAndTime", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
    });

    test("Displays score and time bar", () => {
        const view = new QuestionView();
        initializeDOM();
        view.renderScoreAndTime();
    
        expect(screen.getByTestId("score")).toBeInTheDocument();
        expect(screen.getByTestId("time-bar")).toBeInTheDocument();
    });

    test("If there's no quiz container to render elements in, throw error", () => {
        const view = new QuestionView();
        expect(() => view.renderScoreAndTime()).toThrow(new Error("Missing quiz container to render in"));
    });
});

describe("displayQuestion", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
        initializeDOM();
    });

    test("Displays question with answer choices and re-renders next button", () => {
        const view = new QuestionView();
        view.displayQuestion(question);

        expect(screen.getByText("What day is it?")).toBeInTheDocument();
        expect(screen.getByLabelText("Monday")).toBeInTheDocument();
        expect(screen.getByLabelText("Tuesday")).toBeInTheDocument();
        expect(screen.getByLabelText("Wednesday")).toBeInTheDocument();
        expect(screen.getByLabelText("Thursday")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Next"})).toBeInTheDocument();
    });

    test("Throws error if argument is undefined", () => {
        const view = new QuestionView();

        expect(() => view.displayQuestion())
        .toThrow("Missing question as argument");    
    });

    test("Calls function to render loading screen if argument is null", () => {
        const view = new QuestionView();
        view.renderLoadingScreen = jest.fn();

        view.displayQuestion(null);
        expect(view.renderLoadingScreen).toHaveBeenCalledTimes(1);
    });

    test("If loading screen is visible when about to display a question, remove the screen", () => {
        const view = new QuestionView();
        view.renderLoadingScreen();

        view.displayQuestion(question);

        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
});

describe("Next button behavior", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeDOM();
    });

    test("Next button is enabled when an answer choice is selected", async () => {
        const view = new QuestionView();
        view.renderScoreAndTime();

        view.displayQuestion(question);

        expect(screen.getByRole("button", {name: "Next"})).toBeDisabled();
        userEvent.click(screen.getByLabelText(question.answer));
        expect(screen.getByRole("button", {name: "Next"})).not.toBeDisabled();
    });
});

describe("isValidScore", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Returns true for valid score", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        expect(view.isValidScore(4, 6)).toBeTruthy();
    });

    test("Returns false if missing an argument is undefined", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        expect(view.isValidScore(5, undefined)).toBeFalsy();
        expect(consoleErrorMock)
            .toHaveBeenCalledWith(`Invalid score. The number of questions asked and the number correct must be of type Number. Args: 5, undefined`);
    });

    test("Returns false if argument passed in is not a number", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        expect(view.isValidScore(5, "dog")).toBeFalsy();
    });

    test("Returns false if argument passed in is not a whole number", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        expect(view.isValidScore(-5, 6)).toBeFalsy();
    });

    test("Returns false if number of correctly answered questions is greater than the number asked", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        const numCorrect = 7;
        const numAsked = 6
        expect(view.isValidScore(numCorrect, numAsked)).toBeFalsy();
        expect(consoleErrorMock)
            .toHaveBeenCalledWith(`Invalid score. Number of questions correct is greater than number of questions asked: Number correct: ${numCorrect}, Number asked: ${numAsked}`);
    });
});

describe("updateScore", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeDOM();
    });

    test("Displays 'Score unavailable' if score is invalid", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();
        view.renderScoreAndTime();

        view.updateScore(5);

        expect(screen.getByText("Score unavailable")).toBeInTheDocument();
    });

    test("Updates score", () => {
        const view = new QuestionView();
        view.renderScoreAndTime();

        expect(screen.queryByText("4-10")).not.toBeInTheDocument();

        view.updateScore(4, 10);

        expect(screen.getByText("4-10")).toBeInTheDocument();
    });
});

describe("renderQuizComplete", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeDOM();
    });

    test("If score is invalid, display `Quiz complete` message along with main menu button", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        view.renderQuizComplete(-1);

        expect(screen.getByText("Quiz completed!")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Main"})).toBeInTheDocument();
    });

    test("Shows user's score, appropriate message based on score, main menu button", () => {
        const view = new QuestionView();

        view.renderQuizComplete(2, 5);
        expect(screen.getByText("You scored 2/5!")).toBeInTheDocument();
        expect(screen.getByText('"Great kid. Don\'t get cocky"'))
        expect(screen.getByRole("button", {name: "Main"})).toBeInTheDocument();
    });

    test("Clicking main menu button invokes callback to return to main menu", () => {
        const view = new QuestionView();
        view.onMainButtonClick = jest.fn();

        view.renderQuizComplete(2,5);
        userEvent.click(screen.getByRole("button", {name: "Main"}));

        expect(view.onMainButtonClick).toHaveBeenCalledTimes(1);
    });
});

describe("renderLoadingScreen", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
    });

    test("Shows loading screen, without score or time bar", () => {
        const view = new QuestionView();

        initializeDOM();
        view.renderLoadingScreen();

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("Throws error if unable to find trivia container to render in", () => {
        const view = new QuestionView();

        expect(() => view.renderLoadingScreen()).toThrow(new Error("Could not find quiz container to render in"));
    });
});

describe("getChosenAnswer", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
        initializeDOM();
    });

    test("Returns the selected answer choice as a string", () => {
        const view = new QuestionView();

        view.displayQuestion(question);

        userEvent.click(screen.getByLabelText(question.answer));
        expect(view.getChosenAnswer()).toBe(question.answer);
    });

    test("If no answer is selected, returns null", () => {
        const view = new QuestionView();

        view.displayQuestion(question);

        expect(view.getChosenAnswer()).toBe(null);
    });
});

describe("updateTimeBar", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeDOM();
    });

    test("Scales width of time bar element based on fraction passed in", () => {
        const view = new QuestionView();
        view.renderScoreAndTime();

        view.updateTimeBar(0.45);

        expect(screen.getByTestId("time-bar")).toHaveStyle("transform: scaleX(0.45)");
    });

    test("Prints error if no argument is passed in", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();
        view.renderScoreAndTime();

        view.updateTimeBar();

        expect(consoleErrorMock).toHaveBeenCalledWith(`Invalid arg. Must be a number between 0 and 1. Skipped updating time left on screen. Arg passed in: undefined`);
    });

    test("Prints error if argument is greater than 1", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();
        view.renderScoreAndTime();

        view.updateTimeBar(1.1);

        expect(consoleErrorMock).toHaveBeenCalledWith(`Invalid arg. Must be a number between 0 and 1. Skipped updating time left on screen. Arg passed in: 1.1`);
    });

    test("Prints error if argument is less than 0", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();
        view.renderScoreAndTime();

        view.updateTimeBar(-0.1);

        expect(consoleErrorMock).toHaveBeenCalledWith(`Invalid arg. Must be a number between 0 and 1. Skipped updating time left on screen. Arg passed in: -0.1`);
    });

    test("Prints error if time bar element cannot be found", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        view.updateTimeBar(0.45);

        expect(consoleErrorMock).toHaveBeenCalledWith("Could not find time bar in DOM to update");
    });
});

describe("updateTimeInSeconds", () => {
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeDOM();
    });

    test("Displays time passed in", () => {
        const view = new QuestionView();

        view.renderScoreAndTime();
        view.updateTimeInSeconds(15721);

        expect(screen.getByText(15721)).toBeInTheDocument();
    });

    test("Prints error if time is passed in is invalid. Skips updating time on screen", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        view.renderScoreAndTime();
        view.updateTimeInSeconds();

        expect(consoleErrorMock).toHaveBeenCalledWith("Invalid arg: undefined. Must pass in a whole number");
        expect(screen.queryByText("undefined")).not.toBeInTheDocument();
    });

    test("Prints error and skips updating time if unable to find time element to update", () => {
        consoleErrorMock.mockReturnValueOnce();
        const view = new QuestionView();

        view.updateTimeInSeconds(15721);

        expect(consoleErrorMock).toHaveBeenCalledWith("Could not find time element in DOM to update");
        expect(screen.queryByText(15721)).not.toBeInTheDocument();
    });
});

describe("getQuizCompleteMessage", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    test("Displays appropriate message if user's score is less than 20%", () => {
        const view = new QuestionView();

        expect(view.getQuizCompleteMessage(1, 6)).toBe(`
                <p>"Impressive. Every word in that sentence is wrong"</p>
                <p>- Luke Skywalker</p>
            `);
    }); 

    test("Displays appropriate message if user's score is between 20% - 40%", () => {
        const view = new QuestionView();

        expect(view.getQuizCompleteMessage(2, 6)).toBe(`
                <p>"Let\'s keep a little optimism here"</p>
                <p>- Han Solo</p>
            `);
    });  

    test("Displays appropriate message if user's score is between 40% - 60%", () => {
        const view = new QuestionView();

        expect(view.getQuizCompleteMessage(3, 6)).toBe(`
                <p>"Great kid. Don\'t get cocky"</p>
                <p>- Han Solo</p>
            `);
    });  

    test("Displays appropriate message if user's score is between 60% - 80%", () => {
        const view = new QuestionView();

        expect(view.getQuizCompleteMessage(4, 6)).toBe(`
                <p>"The force is strong with this one"</p>
                <p>- Darth Vader</p>
            `);
    });  

    test("Displays appropriate message if user's score is between 80% - 99%", () => {
        const view = new QuestionView();

        expect(view.getQuizCompleteMessage(5, 6)).toBe("<p>Well I'll be a son of a bantha!</p>");
    });  

    test("Displays appropriate message if user's score is 100%", () => {
        const view = new QuestionView();

        expect(view.getQuizCompleteMessage(6, 6)).toBe(`<p>Well done! You've earned yourself a glass of blue milk on the house.</p>
                <img src="./src/img/blue-milk.png" class="blue-milk-image">`);
    });     
});

describe("initializeAudioButtonBehavior", () => {
    let audioPlayMock;
    let audioPauseMock;
    let consoleErrorMock;
    beforeAll(() => {
        jest.restoreAllMocks();
        audioPlayMock = jest.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation();
        audioPauseMock = jest.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation();
        consoleErrorMock = jest.spyOn(console, "error");
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeDOM();
    });

    test("Clicking audio button to play music changes text of button appropriately", () => {
        const view = new QuestionView();

        view.initializeAudioButtonBehavior();
        userEvent.click(screen.getByText("Bartender, can you put on some tunes?"));

        expect(screen.queryByText("Bartender, can you put on some tunes?")).not.toBeInTheDocument();
        expect(screen.getByText("Bartender, turn that noise off!")).toBeInTheDocument();
        expect(audioPlayMock).toHaveBeenCalledTimes(1);
    });

    test("Clicking audio button to stop music changes text of button appropriately", () => {
        const view = new QuestionView();
        view.isAudioPaused = jest.fn()
            .mockReturnValueOnce(true)
            .mockReturnValue(false);

        view.initializeAudioButtonBehavior();
        userEvent.click(screen.getByText("Bartender, can you put on some tunes?"));
        userEvent.click(screen.getByText("Bartender, turn that noise off!"));

        expect(screen.queryByText("Bartender, turn that noise off!")).not.toBeInTheDocument();
        expect(screen.getByText("Bartender, can you put on some tunes?")).toBeInTheDocument();
        expect(audioPauseMock).toHaveBeenCalledTimes(1);
    });

    test("If unable to find audio element to play/pause, prints error and returns", () => {
        consoleErrorMock.mockReturnValueOnce();
        cleanUpDOM();
        const view = new QuestionView();

        view.initializeAudioButtonBehavior();

        expect(consoleErrorMock).toHaveBeenCalledWith("Unable to set onClick callback for audio button: TypeError: Cannot set property 'onclick' of null");
    });
});

describe("initializeView", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeDOM();
    });

    test("Calls functions to initialize audio behavior for audio button and render start screen", () => {
        const view = new QuestionView();

        view.initializeAudioButtonBehavior = jest.fn();
        view.renderStartScreen = jest.fn();
        view.onStartScreenRender = jest.fn();

        view.initializeView();

        expect(view.initializeAudioButtonBehavior).toHaveBeenCalledTimes(1);
        expect(view.renderStartScreen).toHaveBeenCalledTimes(1);
        expect(view.onStartScreenRender).toHaveBeenCalledTimes(1);
    });
});

describe("returnToStartScreen", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        cleanUpDOM();
        initializeDOM();
    });

    test("Calls functions to render start screen and request model to create questions", () => {
        const view = new QuestionView();

        view.renderStartScreen = jest.fn();
        view.onStartScreenRender = jest.fn();

        view.returnToStartScreen();

        expect(view.renderStartScreen).toHaveBeenCalledTimes(1);
        expect(view.onStartScreenRender).toHaveBeenCalledTimes(1);
    });
});
