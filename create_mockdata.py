import json
import os

import pandas as pd

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


def extract_unique_values_with_ids(df: pd.DataFrame, column: str) -> dict[int, str]:
    r = extract_unique_values(df, column)
    return {i: e for i, e in enumerate(r)}


def get_all_movies(df: pd.DataFrame, save_mock_filters: bool = False):
    names_based_on_col_and_id = {
        "genres": extract_unique_values_with_ids(df, "genres"),
        "keywords": extract_unique_values_with_ids(df, "keywords"),
        "spoken_languages": extract_unique_values_with_ids(df, "spoken_languages"),
        "production_companies": extract_unique_values_with_ids(
            df, "production_companies"
        ),
        "production_countries": extract_unique_values_with_ids(
            df, "production_countries"
        ),
    }

    if save_mock_filters:
        for column, id_name in names_based_on_col_and_id.items():
            with open(f"mock_{column}.json", "w", encoding="utf-8") as f:
                data = [{"id": _id, "name": name} for _id, name in id_name.items()]
                json.dump(data, f, indent=4)
            print(f"Data written to mock_{column}.json")

    ids_based_on_col_and_name = {
        k: {v: i for i, v in names_based_on_col_and_id[k].items()}
        for k in names_based_on_col_and_id
    }

    for _, movie_row in df.iterrows():
        movie_data = {}
        for col in [
            "id",
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

            ids_based_on_name = ids_based_on_col_and_name[col]

            movie_data[col] = [
                {"id": ids_based_on_name[name], "name": name}
                for name in movie_row[col].split(", ")
            ]

        yield movie_data


if __name__ == "__main__":
    in_file_name = "TMDB_movie_dataset.csv"
    if in_file_name not in os.listdir():
        raise FileNotFoundError(
            f"{in_file_name} not found. Download it from {DOWNLOAD_DATA_URL} and unzip it in the same directory as this script with the correct filename."
        )

    MOVIE_COUNT = 50
    df = pd.read_csv(in_file_name)
    df.dropna(
        subset=["id", "title", "release_date", "overview", "runtime"], inplace=True
    )  # Drop rows with missing values in these columns, as they are required
    df = df.head(MOVIE_COUNT)
    print("Done reading CSV")

    all_movies = get_all_movies(df, save_mock_filters=True)

    with open("mock_movies.json", "w") as f:
        json.dump(list(all_movies), f, indent=4)
    print("Data written to mock_movies.json")
