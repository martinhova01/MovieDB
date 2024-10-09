import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <main className="w-dvw text-center">
            <h1 className="text-2xl">404 - Not Found</h1>
            <Link to="/" className="text-primary hover:underline">
                Return to home page
            </Link>
        </main>
    );
}

export default NotFoundPage;
