import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
import Movies from './Movies';
import MoviesBooking from './MoviesBooking';
import './App.css';
import UserSelect from "./UserSelect";
import UserPage from "./UserPage";
import {ThemeProvider, useTheme} from './ThemeContext'

function App() {
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const [contentMoon, setContentMoon] = useState('🌙');
    const [contentSun, setContentSun] = useState('☀️');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const moviesResponse = await axios.get(`http://localhost:8080/movies`);
                setMovies(moviesResponse.data);

                const usersResponse = await axios.get(`http://localhost:8080/users`);
                setUsers(usersResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const button = document.querySelector('.modeButton');
        if (button) {
            button.textContent = isDarkMode ? contentMoon: contentSun ;
        }
    }, [isDarkMode, contentMoon, contentSun]);

    useEffect(() => {
        setContentMoon(document.querySelector('.modeButton').getAttribute('data-content-kuu'));
        setContentSun(document.querySelector('.modeButton').getAttribute('data-content-paike'));
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
        <div className={`App ${isDarkMode ? 'dark' : 'light'}` }>
            <button className="modeButton" onClick={toggleTheme} data-content-kuu="🌙" data-content-paike="☀️">
            </button>
            <Routes>
                <Route path="/" element={<UserSelect users={users} handleUsernameSelect={handleUsernameSelect}/>}/>
                <Route path="/users/:username"
                       element={<UserPage users={users} username={selectedUsername} navigate={navigate}/>}/>
                <Route path="/movies"
                       element={<Movies username={selectedUsername} movies={movies} onSelectMovie={handleMovieSelect}
                                        navigate={navigate} users={users}/>}/>
                <Route path="/movie/:id" element={<MoviesBooking movie={selectedMovie} username={selectedUsername}
                                                                 navigate={navigate}/>}/>
            </Routes>
        </div>
    );
}

function Main() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <Routes>
                    <Route path="*" element={<App/>}/>
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default Main;
