import mongoose from "mongoose";

async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb://localhost:27017/T26-Project-2");
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB\n", error);
        process.exit(1);
    }
}

export default connectToDatabase;
