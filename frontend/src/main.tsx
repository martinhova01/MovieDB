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

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    uri: "http://localhost:3001/",
    cache: new InMemoryCache({
        addTypename: false,
        typePolicies: {
            Query: {
                fields: {
                    movies: {
                        // Cache seperate results based on the filters, sortOption and search
                        keyArgs: ["filters", "sortOption", "search"],

                        // Concatenate the incoming list items with the existing list items
                        merge(existing, incoming, { args }) {
                            const merged = existing ? existing.slice(0) : [];
                            const skip = args?.skip || 0;
                            for (let i = 0; i < incoming.length; ++i) {
                                merged[skip + i] = incoming[i];
                            }
                            return merged;
                        },
                    },
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
