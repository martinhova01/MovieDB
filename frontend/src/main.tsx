import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const client = new ApolloClient({
    uri: "http://localhost:3001/",
    cache: new InMemoryCache(),
});

// Example query using Apollo Client (backend server must be running)
// Read more https://www.apollographql.com/docs/react/get-started
client
    .query({
        query: gql`
            query GetMovies {
                movies(skip: 10, limit: 3) {
                    title
                    tagline
                    release_date
                }
            }
        `,
    })
    .then((result) => console.log(result));

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
