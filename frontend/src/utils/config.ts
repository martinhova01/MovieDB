const BACKEND_PORT = 3001;

// Use production backend when code is built, but local backend when developing/testing
const BACKEND_URL =
    import.meta.env.MODE === "production"
        ? `http://it2810-26.idi.ntnu.no:${BACKEND_PORT}`
        : `http://localhost:${BACKEND_PORT}`;

export { BACKEND_URL };
