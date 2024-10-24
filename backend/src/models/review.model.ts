import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    movie_id: Number,
    username: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model("Review", ReviewSchema, "reviews");

export default ReviewModel;
