import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div>
            <h1>404 Not Found</h1>
            <Link to="/">Return to home page</Link>
        </div>
    );
}

export default NotFoundPage;
