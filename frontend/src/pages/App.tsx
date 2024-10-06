import { Button } from "../shadcn/components/ui/button";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <div>
            <Button>shadcn button</Button>
            <Outlet />
        </div>
    );
}

export default App;
