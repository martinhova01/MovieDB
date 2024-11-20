import { validateReview, validateUsername } from "@/utils/userInputValidation";

describe("validateUsername", () => {
    it("should return true for valid username", () => {
        expect(validateUsername("a".repeat(3))).toBe(true);
        expect(validateUsername("a".repeat(10))).toBe(true);
        expect(validateUsername("a".repeat(20))).toBe(true);
    });

    it("should return false for invalid username", () => {
        expect(validateUsername("a".repeat(1))).toBe(false);
        expect(validateUsername("a".repeat(2))).toBe(false);

        expect(validateUsername("a".repeat(21))).toBe(false);
        expect(validateUsername("a".repeat(100))).toBe(false);
    });
});

describe("validateReview", () => {
    it("should return true for valid review", () => {
        expect(validateReview("a".repeat(0))).toBe(true);
        expect(validateReview("a".repeat(1))).toBe(true);
        expect(validateReview("a".repeat(250))).toBe(true);
        expect(validateReview("a".repeat(1500))).toBe(true);
    });

    it("should return false for invalid review", () => {
        expect(validateReview("a".repeat(3000))).toBe(false);
        expect(validateReview("a".repeat(1501))).toBe(false);
    });
});
