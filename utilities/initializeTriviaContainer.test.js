import { initializeTriviaContainer } from "./initializeTriviaContainer.js";
import { cleanUpDOM } from "./cleanUpDOM.js";
import { QuestionView } from "../QuestionView.js";

describe("initializeTriviaContainer", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
    });

    test("Only element in DOM should be trivia container", () => {
        const view = new QuestionView();
        initializeTriviaContainer();
    
        expect(document.body.innerHTML).toBe(`<div class="trivia-container"></div>`);
    });
});