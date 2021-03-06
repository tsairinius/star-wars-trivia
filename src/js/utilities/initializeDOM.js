export function initializeDOM() {
        document.body.innerHTML = `
            <audio class="cantina-song" loop="true">
                <source src="./audio/cantina-song.mp3" type="audio/mp3"/>
                <source src="./audio/cantina-song.wav" type="audio/wav"/>
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
                            <img src="./img/data-port.svg" class="data-port" alt=""/>
                        </div>
                    </div>
                </div>
                <p class="audio-control">Bartender, can you put on some tunes?</p>
            </div>`
}