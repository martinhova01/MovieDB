import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routerConfig from "./utils/routerConfig.tsx";

const router = createBrowserRouter(routerConfig, { basename: "/project2" });

function App() {
    return <RouterProvider router={router} />;
}

export default App;
