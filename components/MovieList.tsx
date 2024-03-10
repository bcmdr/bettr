import React, { useState } from "react";
import "./MovieList.css";

interface Movie {
  title: string;
  year: number;
  selected: boolean;
  rank: number;
}

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([
    { title: "Superbad", year: 2007, selected: false, rank: -1 },
    { title: "The Hangover", year: 2009, selected: false, rank: -1 },
    {
      title: "Monty Python and the Holy Grail",
      year: 1975,
      selected: false,
      rank: -1,
    },
    { title: "Airplane!", year: 1980, selected: false, rank: -1 },
    {
      title: "Anchorman: The Legend of Ron Burgundy",
      year: 2004,
      selected: false,
      rank: -1,
    },
    { title: "Dumb and Dumber", year: 1994, selected: false, rank: -1 },
    { title: "Shaun of the Dead", year: 2004, selected: false, rank: -1 },
    { title: "Bridesmaids", year: 2011, selected: false, rank: -1 },
    { title: "Napoleon Dynamite", year: 2004, selected: false, rank: -1 },
    {
      title: "The Grand Budapest Hotel",
      year: 2014,
      selected: false,
      rank: -1,
    },
  ]);

  const toggleSelect = (index: number) => {
    const newMovies = [...movies];
    newMovies[index].selected = !newMovies[index].selected;
    setMovies(newMovies);
    updateRanks();
  };

  const moveRank = (index: number, direction: "up" | "down") => {
    const newMovies = [...movies];
    const currentRank = newMovies[index].rank;
    if (direction === "up") {
      let swap = newMovies.find((movie) => movie.rank === currentRank - 1);
      if (!swap) return;
      swap.rank++;
      newMovies[index].rank--;
    } else if (direction === "down") {
      let swap = newMovies.find((movie) => movie.rank === currentRank + 1);
      if (!swap) return;
      swap.rank--;
      newMovies[index].rank++;
    }
    setMovies(newMovies);
  };

  const updateRanks = () => {
    const selected = movies.filter((movie) => movie.selected);
    const unselected = movies.filter((movie) => !movie.selected);
    let rank = 1;
    const updatedMovies = selected.map((movie) => {
      movie.rank = rank++;
      return movie;
    });
    setMovies([...updatedMovies, ...unselected]);
  };

  return (
    <div>
      <h2>Movie List</h2>
      <ul>
        {movies
          .sort((a, b) => {
            return b.rank - a.rank;
          })
          .sort((x, y) => {
            return x.selected == true ? -1 : y.selected == true ? 1 : 0;
          })
          .map((movie, index) => (
            <li
              key={index}
              className={`choice ${movie.selected && "selected"}`}
            >
              <span onClick={() => toggleSelect(index)}>
                {movie.selected && `${movie.rank}. `}
                {movie.title} ({movie.year})
              </span>
              {movie.selected && (
                <div>
                  <button
                    className={`btn`}
                    onClick={() => moveRank(index, "up")}
                  >
                    Better
                  </button>
                  {/* <button
                    className="btn"
                    onClick={() => moveRank(index, "down")}
                  >
                    Down
                  </button> */}
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MovieList;
