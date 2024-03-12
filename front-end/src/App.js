import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Movies from './Movies';
import MoviesBooking from './MoviesBooking';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUsername, setSelectedUsername] = useState(null);

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

    function handleUsernameSelect(username) {//TODO: fix the navigating issues
        // Set the selected username to state
        setSelectedUsername(username);
        // Automatically navigate to "/movies" after a username is clicked
        return (<Router>
            <Routes>
            <Route
                path="/movies"
                element={
                    <Movies
                        username={selectedUsername}
                        movies={movies}
                    />
                }
            /></Routes>
        </Router>)
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <header className="App-header">
                                <h2>Vali enda kasutaja:</h2>
                                <div>
                                    {users.map((user) => {
                                        return (
                                            <button key={user.id} onClick={() => handleUsernameSelect(user.username)}>
                                                {user.username}
                                            </button>
                                        );
                                    })}
                                </div>
                            </header>
                        }
                    />
                    <Route
                        path="/movies"
                        element={
                            <Movies
                                username={selectedUsername}
                                movies={movies}
                            />
                        }
                    />
                    <Route
                        path="/movie/:id"
                        element={<MoviesBooking />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
