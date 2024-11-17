import { MongoMemoryServer } from "mongodb-memory-server";
import { createApolloServer } from "./server.js";
import MovieModel from "./models/movie.model.js";
import ReviewModel from "./models/review.model.js";

const mongoServer = await MongoMemoryServer.create({
    instance: {
        port: 28017, // Chosen fixed port
    },
});

const uri = mongoServer.getUri();

createApolloServer({ port: 3001 }, uri).then(({ url }) => {
    console.log(`🚀 Server ready at: ${url}`);
});

await MovieModel.createCollection();
await ReviewModel.createCollection();
