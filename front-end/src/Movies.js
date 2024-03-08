import React from 'react';
import './Movies.css'; // Import the CSS file

const Movies = ({ movies }) => (
    <div className="movies-container">
        <h1 className="movies-title">Cinema</h1>
        <table className="movies-table">
            <thead>
            <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Age Rating</th>
            </tr>
            </thead>
            <tbody>
            {movies.map(movie => (
                <tr key={movie.id}>
                    <td>{movie.title}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.ageRating}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

export default Movies;
