import { Card, CardContent, CardHeader } from "@/shadcn/components/ui/card";
import { Skeleton } from "@/shadcn/components/ui/skeleton";

const MovieCardSkeleton = () => {
    return (
        <Card className="m-0 shadow-lg hover:cursor-pointer hover:shadow-slate-600">
            <CardHeader className="aspect-[2/3] p-2">
                <Skeleton className="h-full" />
            </CardHeader>
            <CardContent className="flex flex-col items-center px-2 pb-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-5/6" />
            </CardContent>
        </Card>
    );
};

export default MovieCardSkeleton;
