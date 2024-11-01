import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    movie: { type: Number, ref: "Movie" },
    username: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model("Review", ReviewSchema, "reviews");

export default ReviewModel;
