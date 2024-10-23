import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    NormalizedCacheObject,
} from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { offsetLimitPagination } from "@apollo/client/utilities";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    uri: "http://localhost:3001/",
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    movies: offsetLimitPagination(),
                },
            },
        },
    }),
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </StrictMode>
);
