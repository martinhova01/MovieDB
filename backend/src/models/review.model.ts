import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    movie_id: Number,
    username: String,
    rating: Number,
    description: String,
    review_date: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model("Review", ReviewSchema, "reviews");

export default ReviewModel;
