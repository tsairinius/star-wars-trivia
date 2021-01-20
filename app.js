import { QuestionController } from "./QuestionController.js";
import { QuestionModel } from "./QuestionModel.js";
import { QuestionView } from "./QuestionView.js";

const questionModel = new QuestionModel();
const questionView = new QuestionView();
const questionController = new QuestionController(questionModel, questionView);

questionView.initializeTriviaContainer();
questionView.renderStartScreen();
