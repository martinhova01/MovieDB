import { cn } from "@/shadcn/lib/utils";
import React from "react";

type LoaderProps = {
    color?: "stroke-primary" | "stroke-secondary";
    size?: "sm" | "md" | "lg";
} & React.HTMLAttributes<HTMLDivElement>;

const Loader = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<LoaderProps>
>(
    (
        {
            className,
            children,
            color = "stroke-primary",
            size = "md",
            ...props
        },
        ref
    ) => {
        const sizeClass =
            size === "sm"
                ? "h-6 w-6"
                : size === "lg"
                  ? "h-16 w-16"
                  : "h-12 w-12";

        return (
            <div
                ref={ref}
                className={cn(
                    "m-2 flex flex-col items-center justify-center gap-2",
                    className
                )}
                role="status"
                aria-live="polite"
                {...props}
            >
                <svg
                    viewBox="0 0 800 800"
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn(
                        "animate-spin stroke-primary",
                        sizeClass,
                        color
                    )}
                >
                    <circle
                        cx="400"
                        cy="400"
                        fill="none"
                        r="350"
                        strokeWidth="64"
                        strokeDasharray="1648,550"
                        strokeLinecap="round"
                    />
                </svg>
                {children ? (
                    children
                ) : (
                    <span className="sr-only">Loading...</span>
                )}
            </div>
        );
    }
);

export default Loader;
