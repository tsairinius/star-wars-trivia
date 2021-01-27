import { QuestionController } from "./QuestionController.js";
import { QuestionModel } from "./QuestionModel.js";
import { QuestionView } from "./QuestionView.js";

document.addEventListener("DOMContentLoaded", () => {
    const questionModel = new QuestionModel(5);
    const questionView = new QuestionView();
    const questionController = new QuestionController(questionModel, questionView);
    // questionView.renderStartScreen();

    questionView.initializeView();

    // const audio = document.querySelector(".cantina-song");

    // const audioButton = document.querySelector(".audio-control");
    // audioButton.onclick = () => {
    //     if (audio.paused) {
    //         audio.play();
    //     }
    //     else {
    //         audio.pause();
    //     }
    // }

})
