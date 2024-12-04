import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import depthLimit from "graphql-depth-limit";
import type { ListenOptions } from "net";
import connectToDatabase from "./db/database.js";
import resolvers from "./resolvers/resolvers.js";
import { typeDefs } from "./schemas/schema.js";

/**
 * Creates and starts an Apollo Server instance. Will connect to the database before starting the server.
 *
 * @param listenOptions - The options for the server to listen on. (e.g. port)
 * @param databaseUri - The URI of the database to connect to.
 * @returns An object containing the server instance and the URL it is listening on.
 *
 * @throws Will throw an error if the server fails to start or the database connection fails.
 */
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
