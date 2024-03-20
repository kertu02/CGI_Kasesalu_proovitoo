import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css';

const UserPage = ({ username, navigate }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/${username}`);
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [username]);

    if (!currentUser) {
        return <div className="user-not-found">User not found</div>;
    }

    const formatStartTime = startTime => {
        const date = new Date(startTime);
        const day = padZero(date.getDate());
        const month = padZero(date.getMonth() + 1); // Month is zero-based
        const year = date.getFullYear();
        const hours = padZero(date.getHours());
        const minutes = padZero(date.getMinutes());
        return `${hours}:${minutes} ${day}.${month}.${year}`;
    };

    const padZero = num => (num < 10 ? "0" + num : num);

    function handleReturnToMovies() {
        navigate('/movies');
    }

    return (
        <div className="user-profile">
            <h1 className="profile-username">{currentUser.username}</h1>
            <div className="profile-container">
                <h3 className="movies-heading">Vaadatud filmid:</h3>
                {currentUser.watchedMovies.length === 0 ? (
                    <p className="no-movies-message">Te pole veel ühtegi filmi vaadanud.</p>
                ) : (
                    <table className="movies-table">
                        <thead>
                        <tr>
                            <th className="custom-th">Pealkiri</th>
                            <th className="custom-th">Žanr</th>
                            <th className="custom-th">Keel</th>
                            <th className="custom-th">Algusaeg</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentUser.watchedMovies.map((movie, index) => (
                            <tr key={index}>
                                <td>{movie.title}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.language}</td>
                                <td>{formatStartTime(movie.startTime)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button className="custom-button" onClick={handleReturnToMovies}>Tagasi filmide lehele</button>
        </div>
    );
};

export default UserPage;
