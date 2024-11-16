import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import depthLimit from "graphql-depth-limit";
import type { ListenOptions } from "net";
import connectToDatabase from "./db/database.js";
import resolvers from "./resolvers/resolvers.js";
import { typeDefs } from "./schemas/schema.js";

export async function createApolloServer(
    listenOptions: ListenOptions,
    databaseUri: string
) {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        validationRules: [depthLimit(2)],
    });

    await connectToDatabase(databaseUri);

    const { url } = await startStandaloneServer(server, {
        listen: listenOptions,
    });

    return { server, url };
}

if (process.env.NODE_ENV !== "test") {
    createApolloServer(
        { port: 3001 },
        "mongodb://localhost:27017/T26-Project-2"
    ).then(({ url }) => {
        console.log(`🚀 Server ready at: ${url}`);
    });
}
