import React, { useCallback, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './Movies.css';

const Movies = ({ movies }) => {

    // State variables for filters
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedStartTimes, setSelectedStartTimes] = useState([]);
    const [selectedAgeRatings, setSelectedAgeRatings] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Function to toggle the visibility of filters
    const toggleFilters = () => {
        setShowFilters(prevState => !prevState);
    };

    // Function to filter movies based on selected criteria
    const filterMovies = useCallback(() => {
        let filtered = [...movies]; // Copy of movies arrays to work with

        // Apply filters
        if (selectedGenres.length > 0) filtered = filtered.filter(movie => selectedGenres.includes(movie.genre));
        if (selectedStartTimes.length > 0) filtered = filtered.filter(movie => selectedStartTimes.includes(new Date(movie.startTime).getHours().toString()));
        if (selectedAgeRatings.length > 0) filtered = filtered.filter(movie => selectedAgeRatings.includes(movie.ageRating.toString()));
        if (selectedLanguages.length > 0) filtered = filtered.filter(movie => selectedLanguages.includes(movie.language));

        setFilteredMovies(filtered);
    }, [movies, selectedGenres, selectedStartTimes, selectedAgeRatings, selectedLanguages]);

    // State variable for filtered movies
    const [filteredMovies, setFilteredMovies] = useState([]);

    // Apply filters whenever any filter changes
    useEffect(() => {
        filterMovies();
    }, [filterMovies]);

    // Event handlers for filter options
    const handleGenreChange = event => {
        const { value, checked } = event.target;
        setSelectedGenres(prevGenres => checked ? [...prevGenres, value] : prevGenres.filter(genre => genre !== value));
    };
    const handleStartTimeChange = event => {
        const { value, checked } = event.target;
        setSelectedStartTimes(prevStartTimes => checked ? [...prevStartTimes, value] : prevStartTimes.filter(startTime => startTime !== value));
    };
    const handleAgeRatingChange = event => {
        const { value, checked } = event.target;
        setSelectedAgeRatings(prevAgeRatings => checked ? [...prevAgeRatings, value] : prevAgeRatings.filter(ageRating => ageRating !== value));
    };
    const handleLanguageChange = event => {
        const { value, checked } = event.target;
        setSelectedLanguages(prevLanguages => checked ? [...prevLanguages, value] : prevLanguages.filter(language => language !== value));
    };

    // Generate days of the week based on filtered movies
    const generateDaysOfWeek = () => {
        if (filteredMovies.length === 0) return []; // Return empty array if there are no movies

        const daysOfWeek = [];

        // Find the earliest start time from the filtered movie data
        const earliestStartTime = new Date(Math.min(...filteredMovies.map(movie => new Date(movie.startTime).getTime())));
        const today = new Date(earliestStartTime); // Get the earliest start time

        for (let i = 0; i < 4; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const formattedDate = formatDate(date);
            const label = formattedDate.split(', ')[0]; // Extract the weekday
            const dayDate = formattedDate.substring(formattedDate.indexOf(',') + 2); // Extract the day and month

            // Find movies for this day from filteredMovies
            const dayMovies = filteredMovies.filter(movie => {
                const movieDate = formatDate(new Date(movie.startTime));
                return movieDate === formattedDate;
            });

            // Only add the day if there are movies for that day
            if (dayMovies.length > 0)
                daysOfWeek.push({ label, date: dayDate, movies: dayMovies });
        }
        return daysOfWeek;
    };

    // Format the start time
    const formatStartTime = startTime => {
        const date = new Date(startTime);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${padZero(hours)}:${padZero(minutes)}`;
    };

    // Pad single digit numbers with leading zero
    const padZero = num => {
        return num < 10 ? '0' + num : num;
    };

    // Format date as "Day, DD.MM"
    const formatDate = date => {
        const options = { weekday: 'long', day: '2-digit', month: '2-digit' };
        return date.toLocaleDateString('et-EE', options);
    };

    return (
        <div>
            <h1 className="movies-title">KINOKAVA</h1>
            <button className="history-button">Soovita filme vaatamisajaloo põhjal</button>
            <button className="filter-button" onClick={toggleFilters}>Filtrid</button>
            {showFilters && (
                <div className="filter-modal">
                    <table className="filter-table">
                        <tbody>
                        <tr>
                            <td><label htmlFor="genre-filter">Žanr:</label></td>
                            <td>
                                <div className="filter-options">
                                    <input type="checkbox" id="documentary" name="genre" value="Dokumentaal"
                                           checked={selectedGenres.includes("Dokumentaal")} onChange={handleGenreChange}/>
                                    <label htmlFor="documentary">Dokumentaal</label>
                                    <input type="checkbox" id="drama" name="genre" value="Draama"
                                           checked={selectedGenres.includes("Draama")} onChange={handleGenreChange}/>
                                    <label htmlFor="drama">Draama</label>
                                    <input type="checkbox" id="comedy" name="genre" value="Komöödia"
                                           checked={selectedGenres.includes("Komöödia")} onChange={handleGenreChange}/>
                                    <label htmlFor="comedy">Komöödia</label>
                                    <input type="checkbox" id="sci-fi" name="genre" value="Ulme"
                                           checked={selectedGenres.includes("Ulme")} onChange={handleGenreChange}/>
                                    <label htmlFor="sci-fi">Ulme</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><label htmlFor="ageRating-filter">Vanusepiirang:</label></td>
                            <td>
                                <div className="filter-options">
                                    <input type="checkbox" id="no-restriction" name="ageRating" value="0"
                                           checked={selectedAgeRatings.includes("0")} onChange={handleAgeRatingChange}/>
                                    <label htmlFor="no-restriction">Vanusepiirang puudub</label>
                                    <input type="checkbox" id="K-12" name="ageRating" value="12"
                                           checked={selectedAgeRatings.includes("12")}
                                           onChange={handleAgeRatingChange}/>
                                    <label htmlFor="K-12">K-12</label>
                                    <input type="checkbox" id="K-16" name="ageRating" value="16"
                                           checked={selectedAgeRatings.includes("16")}
                                           onChange={handleAgeRatingChange}/>
                                    <label htmlFor="K-16">K-16</label>
                                    <input type="checkbox" id="K-18" name="ageRating" value="18"
                                           checked={selectedAgeRatings.includes("18")}
                                           onChange={handleAgeRatingChange}/>
                                    <label htmlFor="K-18">K-18</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><label htmlFor="startTime-filter">Algusaeg:</label></td>
                            <td>
                                <div className="filter-options">
                                    <input type="checkbox" id="17" name="startTime" value="17"
                                           checked={selectedStartTimes.includes("17")}
                                           onChange={handleStartTimeChange}/>
                                    <label htmlFor="17">17:00</label>
                                    <input type="checkbox" id="18" name="startTime" value="18"
                                           checked={selectedStartTimes.includes("18")}
                                           onChange={handleStartTimeChange}/>
                                    <label htmlFor="18">18:00</label>
                                    <input type="checkbox" id="19" name="startTime" value="19"
                                           checked={selectedStartTimes.includes("19")}
                                           onChange={handleStartTimeChange}/>
                                    <label htmlFor="19">19:00</label>
                                    <input type="checkbox" id="20" name="startTime" value="20"
                                           checked={selectedStartTimes.includes("20")}
                                           onChange={handleStartTimeChange}/>
                                    <label htmlFor="20">20:00</label>
                                    <input type="checkbox" id="21" name="startTime" value="21"
                                           checked={selectedStartTimes.includes("21")}
                                           onChange={handleStartTimeChange}/>
                                    <label htmlFor="21">21:00</label>
                                    <input type="checkbox" id="22" name="startTime" value="22"
                                           checked={selectedStartTimes.includes("22")}
                                           onChange={handleStartTimeChange}/>
                                    <label htmlFor="22">22:00</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><label htmlFor="language-filter">Keel:</label></td>
                            <td>
                                <div className="filter-options">
                                    <input type="checkbox" id="ET" name="language" value="ET"
                                           checked={selectedLanguages.includes("ET")} onChange={handleLanguageChange}/>
                                    <label htmlFor="ET">eesti</label>
                                    <input type="checkbox" id="EN" name="language" value="EN"
                                           checked={selectedLanguages.includes("EN")} onChange={handleLanguageChange}/>
                                    <label htmlFor="EN">inglise</label>
                                    <input type="checkbox" id="ES" name="language" value="ES"
                                           checked={selectedLanguages.includes("ES")} onChange={handleLanguageChange}/>
                                    <label htmlFor="ES">hispaania</label>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}
            {generateDaysOfWeek().map((day, index) => (
                <div key={index} className="day-container">
                    <h2 className="day-header">{day.label}, {day.date}</h2>
                    <div className="movies-container">
                        <table className="movies-table">
                            <thead>
                            <tr>
                                <th>Pealkiri</th>
                                <th>Žanr</th>
                                <th>Vanusepiirang</th>
                                <th>Algus</th>
                                <th>Keel</th>
                            </tr>
                            </thead>
                            <tbody>
                            {day.movies.map(movie => (
                                <tr key={movie.id}>
                                    <td>
                                        <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                                    </td>
                                    <td>{movie.genre}</td>
                                    <td>{movie.ageRating}</td>
                                    <td>{formatStartTime(movie.startTime)}</td>
                                    <td>{movie.language}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Movies;