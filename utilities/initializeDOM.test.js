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
            <audio class="cantina-song" loop="true">
                <source src="./cantina-song.mp3" type="audio/mp3">
            </audio>
            <div class="trivia-container">
                <div class="trivia-screen-border">
                    <div class="trivia-screen">
                        <div class="quiz-container"></div>
                        <div class="trivia-button"></div>
                    </div>
                </div>
                <div class="control-panel">
                    <div class="lightbulbs-container">
                        <div class="lightbulb lightbulb__correct" data-testid="lightbulb-correct"></div>
                        <div class="lightbulb lightbulb__incorrect" data-testid="lightbulb-incorrect"></div>
                    </div>
                    <div class="filler-button__container">
                        <div class="filler-button__long-duration filler-button__blue"></div>
                        <div class="filler-button__short-duration filler-button__blue"></div>
                        <div class="filler-button__long-duration filler-button_yellow"></div>
                        <div class="filler-button__short-duration filler-button__white"></div>
                        <div class="filler-button__long-duration filler-button__white"></div>
                        <div class="filler-button__short-duration filler-button_yellow"></div>
                        <div class="filler-button__long-duration filler-button__blue"></div>
                        <div class="filler-button__short-duration filler-button_yellow"></div>
                    </div>
                    <div class="data-port-plate">
                        <div class="data-port-hole">
                            <img src="./data-port.png" class="data-port">
                        </div>
                    </div>
                </div>
                <p class="audio-control">Bartender, can you put on some tunes?</p>
            </div>`
        );
    });
});