import { initializeDOM } from "./initializeDOM.js";
import { cleanUpDOM } from "./cleanUpDOM.js";

describe("initializeDOM", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        cleanUpDOM();
    });

    test("DOM contains same elements in body of index.html", () => {
        initializeDOM();
    
        expect(document.body.innerHTML).toBe(`
                <div class="trivia-screen-border">
                        <div class="trivia-screen"></div>
                </div>
                <div class="control-panel">
                        <div class="lightbulb lightbulb__correct" data-testid="lightbulb-correct"></div>
                        <div class="lightbulb lightbulb__incorrect" data-testid="lightbulb-incorrect"></div>
                        <div class="data-port-plate">
                                <div class="data-port-hole">
                                        <img src="./data-port.png" class="data-port">
                                </div>
                        </div>
                </div>`
        );
    });
});