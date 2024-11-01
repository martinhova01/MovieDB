import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import depthLimit from "graphql-depth-limit";
import connectToDatabase from "./db/database.js";
import resolvers from "./resolvers/resolvers.js";
import { typeDefs } from "./schemas/schema.js";

const server = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [depthLimit(2)],
});

await connectToDatabase();

const { url } = await startStandaloneServer(server, {
    listen: { port: 3001 },
});

console.log(`🚀 Server ready at: ${url}`);
