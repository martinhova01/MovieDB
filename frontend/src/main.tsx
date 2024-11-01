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
import { BACKEND_URL } from "./utils/config.ts";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    uri: BACKEND_URL,
    cache: new InMemoryCache({
        typePolicies: {
            Movie: {
                fields: {
                    release_date: {
                        read(value) {
                            return value ? new Date(value) : null;
                        },
                    },
                    reviews: {
                        // Use the latest version of the reviews-list.
                        merge(_, incoming) {
                            return incoming;
                        },
                    },
                },
            },
            Review: {
                fields: {
                    date: {
                        read(value) {
                            return value ? new Date(value) : null;
                        },
                    },
                },
            },
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
                    latestReviews: {
                        keyArgs: false,

                        merge(existing, incoming, { args }) {
                            const merged = existing ? existing.slice(0) : [];
                            const skip = args?.skip || 0;
                            for (let i = 0; i < incoming.length; ++i) {
                                merged[skip + i] = incoming[i];
                            }
                            return merged;
                        },
                    },
                    userReviews: {
                        // Cache seperate results based on username
                        keyArgs: ["username"],

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
