import mongoose from "mongoose";

async function connectToDatabase(uri: string) {
    try {
        await mongoose.connect(uri);
        if (process.env.NODE_ENV !== "test")
            console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB\n", error);
        process.exit(1);
    }
}

export default connectToDatabase;
