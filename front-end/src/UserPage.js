import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPage = ({ username, navigate }) => {
    const [currentUser, setCurrentUser] = useState(username);
    const [watchedMovies, setWatchedMovies] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/${username}`);
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchWatchedMovies = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/${username}/watchedMovies`);
                setWatchedMovies(response.data);
            } catch (error) {
                console.error('Error fetching watched movies:', error);
            }
        };

        fetchUserData();
        fetchWatchedMovies();
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
            <div className="movies-container">
                <p>Vaadatud filmid:</p>
                {watchedMovies.length === 0 ? (
                    <p>Te pole veel ühtegi filmi vaadanud.</p>
                ) : (
                    <table className="movies-table">
                        <thead>
                        <tr>
                            <th className="custom-th">Pealkiri</th>
                            <th className="custom-th">Žanr</th>
                            <th className="custom-th">Keel</th>
                            <th className="custom-th">Algusaeg</th>
                            <th className="custom-th">Istekohad</th>
                        </tr>
                        </thead>
                        <tbody>
                        {watchedMovies.map((watchedMovie, index) => (
                            <tr key={index}>
                                <td>{watchedMovie.movie.title}</td>
                                <td>{watchedMovie.movie.genre}</td>
                                <td>{watchedMovie.movie.language}</td>
                                <td>{formatStartTime(watchedMovie.movie.startTime)}</td>
                                <td>
                                    {watchedMovie.selectedSeats.map((seat, seatIndex) => (
                                        <div key={seatIndex}>
                                            Rida {seat.rowNr}, Veerg {seat.columnNr}
                                        </div>
                                    ))}
                                </td>

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
