import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";

describe("MovieCardSkeleton", () => {
    it("matches snapshot", () => {
        const { asFragment } = render(<MovieCardSkeleton />);
        expect(asFragment()).toMatchSnapshot();
    });
});
