import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import MovieDetailPage from "@/pages/MovieDetailPage";
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
        ],
    },
];

export default routerConfig;
