import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import MoviePage from "./pages/MoviePage.tsx";
import MoviesPage from "./pages/MoviesPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: "",
                element: <MoviesPage />,
            },
            {
                path: "movie/:movieId",
                element: <MoviePage />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
