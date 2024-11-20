import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import connectToDatabase from "../db/database";
import MovieModel from "../models/movie.model";
import ReviewModel from "../models/review.model";
import { movies, reviews } from "./mock/util";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await connectToDatabase(mongoUri);

    await MovieModel.createCollection();
    await ReviewModel.createCollection();
});

beforeEach(async () => {
    await MovieModel.insertMany(movies);
    await ReviewModel.insertMany(reviews);
});

afterEach(async () => {
    await MovieModel.deleteMany({});
    await ReviewModel.deleteMany({});
});

afterAll(async () => {
    if (mongoServer) {
        await mongoServer.stop();
    }

    await mongoose.connection.close();
});
