import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { initializeQuizContainer } from "./app.js";

test("Displays score", () => {
    initializeQuizContainer();

    expect(screen.getByTestId("score").textContent).toBe("0/0");
});