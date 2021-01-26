import { QuestionController } from "./QuestionController.js";
import { QuestionModel } from "./QuestionModel.js";
import { QuestionView } from "./QuestionView.js";

const questionModel = new QuestionModel(1);
const questionView = new QuestionView();
const questionController = new QuestionController(questionModel, questionView);

questionView.renderStartScreen();
