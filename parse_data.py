#!/usr/bin/python3

import json
import os
import sys

import pandas as pd
import pymongo
from tqdm import tqdm

DOWNLOAD_DATA_URL = (
    "https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies"
)


def extract_unique_values(df: pd.DataFrame, column: str) -> set[str]:
    result = set()
    for entries in df[column]:
        if pd.isnull(entries):
            continue
        for entry in entries.split(", "):
            if entry not in result:
                result.add(entry)
    return result


def get_unique_values(df: pd.DataFrame, cols: list[str]) -> dict[str, set[str]]:
    result = {}
    for col in cols:
        result[col] = extract_unique_values(df, col)
    return result


def save_mock_filters(df: pd.DataFrame):
    filterCols = [
        "genres",
        "production_companies",
        "production_countries",
        "spoken_languages",
        "keywords",
    ]

    for column, values in get_unique_values(df, filterCols).items():
        with open(f"mock_{column}.json", "w", encoding="utf-8") as f:
            json.dump(list(values), f, indent=4)
        print(f"Data written to mock_{column}.json")


def get_all_movies(df: pd.DataFrame):
    for _, movie_row in df.iterrows():
        movie_data = {}
        for col in [
            "_id",
            "title",
            "vote_average",
            "vote_count",
            "status",
            "release_date",
            "revenue",
            "runtime",
            "backdrop_path",
            "budget",
            "homepage",
            "imdb_id",
            "original_language",
            "original_title",
            "overview",
            "popularity",
            "poster_path",
            "tagline",
            "decade",
        ]:
            movie_data[col] = movie_row[col] if not pd.isnull(movie_row[col]) else None

        for col in [
            "genres",
            "production_companies",
            "production_countries",
            "spoken_languages",
            "keywords",
        ]:
            if pd.isnull(movie_row[col]):
                movie_data[col] = []
                continue

            movie_data[col] = movie_row[col].split(", ")

        movie_data["reviews"] = []

        yield movie_data


def load_movie_data(rows: int | None = None) -> pd.DataFrame:
    in_file_name = "TMDB_movie_dataset.csv"
    if in_file_name not in os.listdir():
        raise FileNotFoundError(
            f"{in_file_name} not found. Download it from {DOWNLOAD_DATA_URL} and unzip it in the same directory as this script with the correct filename."
        )

    df = pd.read_csv(in_file_name)
    df.dropna(
        subset=["id", "title", "release_date", "overview", "runtime"], inplace=True
    )  # Drop rows with missing values in these columns, as they are required
    df = df[~df["adult"]]
    df.rename({"id": "_id"}, axis=1, inplace=True)
    df.drop_duplicates(subset=["_id"], inplace=True)
    df["decade"] = (df["release_date"].astype(str).str[:4].astype(int) // 10) * 10
    if rows is not None:
        df = df.head(rows)
    print("Done reading CSV")
    return df


def create_mock_data(rows: int = 50):
    df = load_movie_data(rows)

    save_mock_filters(df)
    all_movies = get_all_movies(df)

    with open("mock_movies.json", "w") as f:
        json.dump(list(all_movies), f, indent=4)
    print("Data written to mock_movies.json")


def load_movie_data_chunks(rows: int | None = None, chunksize: int = 1000):
    in_file_name = "TMDB_movie_dataset.csv"
    if in_file_name not in os.listdir():
        raise FileNotFoundError(
            f"{in_file_name} not found. Download it from {DOWNLOAD_DATA_URL} and unzip it in the same directory as this script with the correct filename."
        )

    yielded_movie_count = 0

    with pd.read_csv(in_file_name, chunksize=chunksize) as reader:
        for chunk in reader:
            chunk.dropna(
                subset=["id", "title", "release_date", "overview", "runtime", "imdb_id"],
                inplace=True,
            )  # Drop rows with missing values in these columns, as they are required
            chunk = chunk[~chunk["adult"]]
            chunk.rename({"id": "_id"}, axis=1, inplace=True)
            chunk.drop_duplicates(subset=["_id"], inplace=True)
            chunk["release_date"] = pd.to_datetime(
                chunk["release_date"], errors="coerce"
            )
            chunk["decade"] = (chunk["release_date"].dt.year // 10) * 10
            chunk["revenue"] = chunk["revenue"].astype(float)

            if rows is not None and yielded_movie_count + chunk.shape[0] > rows:
                chunk = chunk.head(rows - yielded_movie_count)
                yield chunk
                break

            yielded_movie_count += chunk.shape[0]
            yield chunk


def fill_db(rows: int | None = None):
    DB_NAME = "T26-Project-2"
    MOVIES_COL_NAME = "movies"
    REVIEWS_COL_NAME = "reviews"

    CLIENT = pymongo.MongoClient("mongodb://localhost:27017/")
    DB = CLIENT[DB_NAME]
    MOVIES_COL = DB[MOVIES_COL_NAME]
    REVIEWS_COL = DB[REVIEWS_COL_NAME]

    if MOVIES_COL.count_documents({}) > 0:
        print("Database already has data. First drop all data.")
        return

    BATCH_SIZE = 1000
    with tqdm(desc="Inserting movies", unit=" movies", total=rows) as pbar:
        for chunk in load_movie_data_chunks(rows, BATCH_SIZE):
            if chunk.empty:
                continue
            movies_batch = get_all_movies(chunk)
            try:
                MOVIES_COL.insert_many(movies_batch, ordered=False)
            except pymongo.errors.BulkWriteError:
                # Ignore duplicate key errors
                # ordered=False is used to continue inserting other documents even if one fails
                pass
            pbar.update(chunk.shape[0])

    print("Done inserting movies")

    print("Removing inappropriate movies...")
    MOVIES_COL.create_index([("popularity", pymongo.DESCENDING)])
    top_movies = (
        MOVIES_COL.find().sort("popularity", pymongo.DESCENDING).skip(9999).limit(1)
    )
    popularity_threshold = top_movies[0]["popularity"]
    MOVIES_COL.delete_many({"popularity": {"$lt": popularity_threshold}})
    print("Done removing inappropriate movies")

    print("Creating indexes...")
    # These indexes are created to speed up filtering/sorting
    MOVIES_COL.create_index("release_date")
    MOVIES_COL.create_index("runtime")
    MOVIES_COL.create_index("vote_average")
    MOVIES_COL.create_index("status")

    # These indexes are created to speed up filtering/sorting and to retrieve unique values
    MOVIES_COL.create_index("genres")
    MOVIES_COL.create_index("spoken_languages")
    MOVIES_COL.create_index("decade")

    REVIEWS_COL.create_index("username")
    REVIEWS_COL.create_index("date")

    print("Done creating indexes")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 parse_data.py mock|db <rows>")
        print("(Set rows to 0 for all rows)")
        sys.exit(1)

    if not sys.argv[2].isdigit():
        print("Rows must be an integer")
        sys.exit(1)

    rows = int(sys.argv[2]) if sys.argv[2] != "0" else None
    if sys.argv[1] == "mock":
        create_mock_data(rows)
    elif sys.argv[1] == "db":
        fill_db(rows)
