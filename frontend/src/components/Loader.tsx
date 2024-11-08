import { cn } from "@/shadcn/lib/utils";

type LoaderProps = {
    size?: "sm" | "md" | "lg";
} & React.HTMLAttributes<HTMLDivElement>;

const Loader = ({
    className,
    children,
    size = "md",
    ...props
}: React.PropsWithChildren<LoaderProps>) => {
    const sizeClass =
        size === "sm" ? "h-6 w-6" : size === "lg" ? "h-16 w-16" : "h-12 w-12";

    return (
        <div
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
                className={cn("animate-spin stroke-primary", sizeClass)}
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
            {children ? children : <span className="sr-only">Loading...</span>}
        </div>
    );
};

export default Loader;
