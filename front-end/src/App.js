import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
import Movies from './Movies';
import MoviesBooking from './MoviesBooking';
import './App.css';
import UserSelect from "./UserSelect";
import UserPage from "./UserPage";

function App() {
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const moviesResponse = await axios.get(`http://localhost:8080/movies`);
                setMovies(moviesResponse.data);

                const usersResponse = await axios.get(`http://localhost:8080/users`);
                setUsers(usersResponse.data);

                const storedUsername = localStorage.getItem('selectedUsername');
                if (storedUsername) {
                    setSelectedUsername(storedUsername);
                }

                if (storedUsername) {
                    const userResponse = await axios.get(`http://localhost:8080/users/${storedUsername}`);
                    setUsers(prevUsers => prevUsers.map(user => user.username === storedUsername ? userResponse.data : user));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    function handleUsernameSelect(username) {
        setSelectedUsername(username);
        localStorage.setItem('selectedUsername', username);
        navigate('/movies');
    }


    function handleMovieSelect(movieId) {
        const selected = movies.find(movie => movie.id === movieId);
        setSelectedMovie(selected);
    }

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<UserSelect users={users} handleUsernameSelect={handleUsernameSelect} />}/>
                <Route path="/users/:username" element={<UserPage users={users} username={selectedUsername} navigate={navigate} />}/>
                <Route path="/movies" element={<Movies username={selectedUsername} movies={movies} onSelectMovie={handleMovieSelect} navigate={navigate} users={users}  />} />
                <Route path="/movie/:id" element={<MoviesBooking movie={selectedMovie} username={selectedUsername} navigate={navigate} />} />
            </Routes>
        </div>
    );
}

function Main() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<App />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Main;
