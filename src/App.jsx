/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./index.css";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "a55941be";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          if (!res.ok)
            throw new Error("Somthing went wrong with fetching movies.");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found!");

          setMovies(data.Search);
        } catch (err) {
          setError(err.message);
          console.log(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length <= 3) {
        setError("");
        setMovies([]);
        return;
      }

      fetchMovies();
    },
    [query]
  );
  return (
    <div className="">
      <Navbar>
        <Logo />
        <SearchBox query={query} onQuery={setQuery} />
        <NumResults moviesLength={movies?.length} />
      </Navbar>

      <main className="main">
        <Box>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && <MovieList movies={movies}></MovieList>}
        </Box>

        <Box>
          <WatchedList></WatchedList>
        </Box>
      </main>
    </div>
  );
}

function Navbar({ children }) {
  return <div className="nav-bar">{children}</div>;
}

function Logo() {
  return (
    <div className="logo">
      <span>🎥</span>
      <h1>movieOmdb</h1>
    </div>
  );
}

function SearchBox({ query, onQuery }) {
  return (
    <input
      className="search"
      type="text"
      value={query}
      onChange={(e) => onQuery(e.target.value)}
      placeholder="Enter movie name..."
    />
  );
}

function NumResults({ moviesLength }) {
  return <span className="num-results">Found {moviesLength} results</span>;
}

function Box({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setOpen(!open)}>
        {open ? <span>&minus;</span> : "+"}
      </button>
      {open ? children : null}
    </div>
  );
}

function MovieList({ movies }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <MovieItem
          image={movie.Poster}
          title={movie.Title}
          year={movie.Year}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}

function Loader() {
  return <h4 className="loader">Loading ...</h4>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

function MovieItem({ image, title, year }) {
  return (
    <li>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>📅 {year}</p>
    </li>
  );
}

function WatchedList() {
  return (
    <>
      <div className="summary">
        <h2>Movie you Watched</h2>
        <div>
          <p>#️⃣ 0 movies</p>
          <p>⭐ 0</p>
          <p>🌟 0</p>
          <p>⏳ 0 min</p>
        </div>
      </div>
    </>
  );
}
