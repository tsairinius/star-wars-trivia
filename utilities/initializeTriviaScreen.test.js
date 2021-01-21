import { initializeTriviaScreen } from "./initializeTriviaScreen.js";
import { cleanUpDOM } from "./cleanUpDOM.js";
import { QuestionView } from "../QuestionView.js";

describe("initializeTriviaScreen", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
    });

    test("Only element in DOM should be trivia container", () => {
        const view = new QuestionView();
        initializeTriviaScreen();
    
        expect(document.body.innerHTML).toBe(`<div class="trivia-screen"></div>`);
    });
});