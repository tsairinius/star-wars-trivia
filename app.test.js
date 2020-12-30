import * as app from "./app.js";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";

beforeAll(() => {
    const element = document.createElement('p');
    document.body.appendChild(element);
})


test("Displays question", () => {
    const question = {
        question: "What day is it?",
        answer: "Monday",
        otherOptions: ["Tuesday", "Wednesday", "Thursday"]
    };

    app.displayNewQuestion(question)

    expect(screen.getByText("What day is it?")).toBeInTheDocument();
});
