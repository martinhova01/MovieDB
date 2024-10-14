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
            "adult",
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
    df.rename({"id": "_id"}, axis=1, inplace=True)
    df.drop_duplicates(subset=["_id"], inplace=True)
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


def fill_db(rows: int | None = None):
    DB_NAME = "T26-Project-2"
    MOVIES_COL_NAME = "movies"

    CLIENT = pymongo.MongoClient("mongodb://localhost:27017/")
    DB = CLIENT[DB_NAME]
    MOVIES_COL = DB[MOVIES_COL_NAME]

    if MOVIES_COL.count_documents({}) > 0:
        print("Database already has data. First drop all data.")
        return

    df = load_movie_data(rows)
    all_movies = get_all_movies(df)
    for movie in tqdm(all_movies, total=len(df.index)):
        MOVIES_COL.insert_one(movie)


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
