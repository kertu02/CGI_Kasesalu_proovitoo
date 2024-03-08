// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Movies from './Movies';
import './App.css'; // Import the CSS file

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  console.log("Movies:", movies);

  return (
      <div className="App">
        <header className="App-header">
          <Movies movies={movies} />
        </header>
      </div>
  );
}

export default App;
