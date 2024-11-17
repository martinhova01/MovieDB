import { ObjectId } from "mongodb";

export const seedDatabase = () => {
    cy.deleteMany({}, { collection: "movies" });
    cy.deleteMany({}, { collection: "reviews" });

    cy.fixture("mock_db_movies").then((seed_movies) => {
        const movie_data = seed_movies.map((movie) => ({
            ...movie,
            release_date: new Date(movie.release_date["$date"]),
            reviews: movie.reviews.map(
                (review) => new ObjectId(review["$oid"] as string)
            ),
        }));
        cy.insertMany(movie_data, { collection: "movies" });
    });

    cy.fixture("mock_db_reviews").then((seed_reviews) => {
        const review_data = seed_reviews.map((review) => ({
            ...review,
            date: new Date(review.date["$date"]),
            _id: new ObjectId(review._id["$oid"] as string),
        }));
        cy.insertMany(review_data, { collection: "reviews" });
    });
};
