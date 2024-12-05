import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Loader from "@/components/Loader";
import React from "react";

describe("Loader", () => {
    it("matches snapshot", () => {
        const { asFragment } = render(<Loader />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders with default props", () => {
        render(<Loader />);

        const loaderDiv = screen.getByRole("status");
        expect(loaderDiv).toBeInTheDocument();
        expect(loaderDiv).toHaveAttribute("aria-live", "polite");

        const loaderSvg = screen.getByRole("status").querySelector("svg");
        expect(loaderSvg).toHaveClass("h-12 w-12");
        expect(loaderSvg).toHaveClass("stroke-primary");

        const srOnly = screen.getByText("Loading...");
        expect(srOnly).toHaveClass("sr-only");
    });

    it("renders with different size", () => {
        render(<Loader size="sm" />);
        const loaderSvg = screen.getByRole("status").querySelector("svg");
        expect(loaderSvg).toHaveClass("h-6 w-6");
    });

    it("renders with large size", () => {
        render(<Loader size="lg" />);
        const loaderSvg = screen.getByRole("status").querySelector("svg");
        expect(loaderSvg).toHaveClass("h-16 w-16");
    });

    it("renders with secondary color", () => {
        render(<Loader color="stroke-secondary" />);
        const loaderSvg = screen.getByRole("status").querySelector("svg");
        expect(loaderSvg).toHaveClass("stroke-secondary");
    });

    it("renders with additional children", () => {
        render(<Loader>Custom Loading Text</Loader>);
        const customText = screen.getByText("Custom Loading Text");
        expect(customText).toBeInTheDocument();

        const srOnly = screen.queryByText("Loading...");
        expect(srOnly).not.toBeInTheDocument();
    });

    it("applies additional className", () => {
        render(<Loader className="custom-class" />);
        const loaderDiv = screen.getByRole("status");
        expect(loaderDiv).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Loader ref={ref} />);
        expect(ref.current).toBeTruthy();
    });
});
