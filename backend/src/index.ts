import { createApolloServer } from "./server.js";

createApolloServer(
    { port: 3001 },
    "mongodb://localhost:27017/T26-Project-2"
).then(({ url }) => {
    console.log(`🚀 Server ready at: ${url}`);
});
