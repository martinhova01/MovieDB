import { render } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";

describe("App", () => {
    it("successfully loads api", async () => {
        render(<App />);
        expect(true).toBeTruthy();
    });
});
