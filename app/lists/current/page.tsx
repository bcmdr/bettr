'use client';

import { useState } from 'react';

interface Movie {
    title: string;
    year: number;
}

const ComedyMoviesPage = () => {
    const [movieList, setMovieList] = useState<Movie[]>([
        { title: "The Hangover", year: 2009 },
        { title: "Superbad", year: 2007 },
        { title: "Step Brothers", year: 2008 },
        { title: "Anchorman", year: 2004 },
        { title: "Bridesmaids", year: 2011 },
        { title: "Dumb and Dumber", year: 1994 },
        { title: "Napoleon Dynamite", year: 2004 },
        { title: "The 40-Year-Old Virgin", year: 2005 },
        { title: "Zoolander", year: 2001 },
        { title: "Mean Girls", year: 2004 },
        { title: "Pitch Perfect", year: 2012 },
        { title: "Talladega Nights", year: 2006 },
        { title: "Hot Fuzz", year: 2007 },
        { title: "Ghostbusters", year: 1984 },
        { title: "Shaun of the Dead", year: 2004 }
    ]);

    function moveMovie(index: number, direction: 'up' | 'down') {
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < movieList.length) {
            const updatedList = [...movieList];
            const movedMovie = updatedList[index];
            updatedList[index] = updatedList[newIndex];
            updatedList[newIndex] = movedMovie;
            setMovieList(updatedList);
        }
    }

    return (
        <div className="container">
            <h1>Comedy Movies List</h1>
            <ul className="movie-list" id="movieList">
                {movieList.map((movie, index) => (
                    <li key={index} className="movie-item">
                        <span>{index + 1}. {movie.title} ({movie.year})</span>
                        <div className="btn-container">
                            <button onClick={() => moveMovie(index, 'up')}>Better</button>
                            <button onClick={() => moveMovie(index, 'down')}>Worse</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ComedyMoviesPage;
