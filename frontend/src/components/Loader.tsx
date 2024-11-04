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
            <div
                className={cn(
                    "animate-spin rounded-full border-4 border-primary border-t-background",
                    sizeClass
                )}
            />
            {children ? children : <span className="sr-only">Loading...</span>}
        </div>
    );
};

export default Loader;
