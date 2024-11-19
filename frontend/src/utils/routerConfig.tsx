import Navbar from "@/components/Navbar";
import ActivityPage from "@/pages/ActivityPage";
import HomePage from "@/pages/HomePage";
import MovieDetailPage from "@/pages/MovieDetailPage";
import MyReviewsPage from "@/pages/MyReviewsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { Toaster } from "@/shadcn/components/ui/sonner";
import { Outlet, RouteObject } from "react-router-dom";

const routerConfig: RouteObject[] = [
    {
        path: "/",
        element: (
            <>
                <Navbar />
                <div id="main-content" tabIndex={-1}>
                    <Outlet />
                </div>
                <Toaster position="bottom-right" />
            </>
        ),
        errorElement: <NotFoundPage />,
        children: [
            {
                path: "",
                element: <HomePage />,
            },
            {
                path: "movie/:movieId",
                element: <MovieDetailPage />,
            },
            {
                path: "activity",
                element: <ActivityPage />,
            },
            {
                path: "myReviews",
                element: <MyReviewsPage />,
            },
        ],
    },
];

export default routerConfig;
