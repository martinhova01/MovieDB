import Navbar from "@/components/Navbar";
import ActivityPage from "@/pages/ActivityPage";
import HomePage from "@/pages/HomePage";
import MovieDetailPage from "@/pages/MovieDetailPage";
import MyReviewsPage from "@/pages/MyReviewsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { Outlet } from "react-router-dom";

const routerConfig = [
    {
        path: "/",
        element: (
            <>
                <Navbar />
                <Outlet />
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
