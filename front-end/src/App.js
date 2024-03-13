import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
import Movies from './Movies';
import MoviesBooking from './MoviesBooking';
import './App.css';
import UserSelect from "./UserSelect";

function App() {
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovies();
        fetchUsers();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/movies`);
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/users`);
            setUsers(response.data);
            console.log('Fetched Users:', response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    function handleUsernameSelect(username) {
        setSelectedUsername(username);
        // Automatically navigate to "/movies" after a username is clicked
        navigate('/movies');
    }

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<UserSelect users={users} handleUsernameSelect={handleUsernameSelect} />}/>
                <Route path="/movies" element={<Movies username={selectedUsername} movies={movies} />} />
                <Route path="/movie/:id" element={<MoviesBooking />} />
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
