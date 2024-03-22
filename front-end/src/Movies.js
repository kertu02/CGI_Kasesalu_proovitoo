// this component represents the Movies view in the application
// it displays a list of movies based on various filters and user preferences

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const Movies = ({ onSelectMovie, navigate, username }) => {
    // defining state variables using useState hook
    const [movies, setMovies] = useState(null); // array of all movies
    const [filteredMovies, setFilteredMovies] = useState([]); // array of filtered movies
    const [currentUser, setCurrentUser] = useState(null); // current user information
    const [selectedGenres, setSelectedGenres] = useState([]); // array of selected genres
    const [selectedStartTimes, setSelectedStartTimes] = useState([]); // array of selected start times
    const [selectedAgeRatings, setSelectedAgeRatings] = useState([]); // array of selected age ratings
    const [selectedLanguages, setSelectedLanguages] = useState([]); // array of selected languages
    const [showFilters, setShowFilters] = useState(false); // boolean to toggle visibility of filters
    const [showPercentageColumn, setShowPercentageColumn] = useState(false); // boolean to toggle visibility of percentage column
    const [isButtonPressed, setIsButtonPressed] = useState(false); // boolean to track if suggest button is pressed

    // function to toggle visibility of filters
    const toggleFilters = () => {
        setShowFilters(prevState => !prevState);
    };

    // function to toggle state of button press
    const togglePressableButton = () => {
        setIsButtonPressed(prevState => !prevState);
    };

    // function to filter movies based on selected filters
    const filterMovies = useCallback(() => {
        if (!movies) return; // return if movies are not loaded yet

        let filtered = [...movies]; // make a copy of movies array to work with

        // filter movies based on selected genres, start times, age ratings, and languages
        if (selectedGenres.length > 0)
            filtered = filtered.filter(movie => selectedGenres.includes(movie.genre));
        if (selectedStartTimes.length > 0)
            filtered = filtered.filter(movie => selectedStartTimes.includes(new Date(movie.startTime).getHours().toString()));
        if (selectedAgeRatings.length > 0)
            filtered = filtered.filter(movie => selectedAgeRatings.includes(movie.ageRating.toString()));
        if (selectedLanguages.length > 0)
            filtered = filtered.filter(movie => selectedLanguages.includes(movie.language));

        setFilteredMovies(filtered); // update filtered movies state
    }, [movies, selectedGenres, selectedStartTimes, selectedAgeRatings, selectedLanguages]);

    // effect to fetch user data and movies data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/${username}`);
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchMovies = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/movies`);
                setMovies(response.data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
        fetchUserData();
    }, [username]);

    // effect to filter movies when filters or movies change
    useEffect(() => {
        filterMovies();
    }, [filterMovies]);

    // effect to filter movies when filters or movies change
    useEffect(() => {
        filterMovies();
    }, [movies, filterMovies]);

    // function to generate days with movies
    const generateDaysWithMovies = () => {
        const daysWithMovies = [];
        const movieDates = filteredMovies.map(movie => formatDate(new Date(movie.startTime)));
        const uniqueDates = [...new Set(movieDates)]; // get unique dates

        uniqueDates.forEach(date => {
            const dayMovies = filteredMovies.filter(movie => formatDate(new Date(movie.startTime)) === date);
            daysWithMovies.push({ date, movies: dayMovies });
        });

        return daysWithMovies;
    };

    // function to format start time
    const formatStartTime = startTime => {
        const date = new Date(startTime);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${padZero(hours)}:${padZero(minutes)}`;
    };

    // function to pad zero to single digit numbers
    const padZero = num => {
        return num < 10 ? '0' + num : num;
    };

    // function to format date
    const formatDate = date => {
        const options = { weekday: 'long', day: '2-digit', month: '2-digit' };
        return date.toLocaleDateString('et-EE', options);
    };

    // event handler for genre change
    const handleGenreChange = event => {
        const { value, checked } = event.target;
        setSelectedGenres(prevGenres => checked ? [...prevGenres, value] : prevGenres.filter(genre => genre !== value));
        setIsButtonPressed(false);
        setShowPercentageColumn(false);
    };

    // event handler for start time change
    const handleStartTimeChange = event => {
        const { value, checked } = event.target;
        setSelectedStartTimes(prevStartTimes => checked ? [...prevStartTimes, value] : prevStartTimes.filter(startTime => startTime !== value));
        setIsButtonPressed(false);
        setShowPercentageColumn(false);
    };

    // event handler for age rating change
    const handleAgeRatingChange = event => {
        const { value, checked } = event.target;
        setSelectedAgeRatings(prevAgeRatings => checked ? [...prevAgeRatings, value] : prevAgeRatings.filter(ageRating => ageRating !== value));
        setIsButtonPressed(false);
        setShowPercentageColumn(false);
    };

    // event handler for language change
    const handleLanguageChange = event => {
        const { value, checked } = event.target;
        setSelectedLanguages(prevLanguages => checked ? [...prevLanguages, value] : prevLanguages.filter(language => language !== value));
        setIsButtonPressed(false);
        setShowPercentageColumn(false);
    };

    // function to navigate to user page
    function handleNavigateToUserPage() {
        navigate(`/users/${currentUser.username}`);
    }

    // function to navigate to home page
    function handleNavigateToHome() {
        navigate('');
    }

    // function to show suggested movies
    async function handleSuggestByMostWatchedGenre() {
        try {
            const response = await axios.get(`http://localhost:8080/users/${username}/watchedMovies`);
            const watchedMovies = response.data;

            if (watchedMovies.length === 0) {
                window.alert("Sa pole veel ühtegi filmi vaadanud.");
                return;
            }

            if (isButtonPressed) {
                togglePressableButton();
                handleRemovingFilters();
                return;
            }

            // calculate the most watched genre
            const genresCount = {};
            watchedMovies.forEach(watchedMovie => {
                genresCount[watchedMovie.movie.genre] = (genresCount[watchedMovie.movie.genre] || 0) + 1;
            });

            const mostWatchedGenre = Object.keys(genresCount).reduce((a, b) => genresCount[a] > genresCount[b] ? a : b);

            // filter movies by the most watched genre and add percentage column
            const suggestedMovies = movies
                .filter(movie => movie.genre === mostWatchedGenre)
                .map(movie => ({
                    ...movie,
                    percentage: ((genresCount[movie.genre] || 0) / watchedMovies.length * 100).toFixed(0) + '%'
                }));

            setFilteredMovies(suggestedMovies);
            setShowPercentageColumn(true);
            setIsButtonPressed(true);
        } catch (error) {
            console.error('Error fetching watched movies:', error);
        }
    }

    // function to handle removing filters
    function handleRemovingFilters() {
        setSelectedGenres([]);
        setSelectedStartTimes([]);
        setSelectedAgeRatings([]);
        setSelectedLanguages([]);
        setFilteredMovies(movies);
        setShowPercentageColumn(false);
        setIsButtonPressed(false);
    }

    // component rendering movies and filter options
    return (
        <div>
            <h1 className="movies-title">KINOKAVA</h1>
            <div className="top-container">
                <button className="custom-button" onClick={handleNavigateToUserPage}>Minu profiil</button>
                <button className="custom-button" onClick={handleNavigateToHome}>Vaheta kasutajat</button>
            </div>
            <button className="custom-button" onClick={toggleFilters}>Filtrid</button>
            {/* Filter options modal */}
            {showFilters && (
                <div className="filter-modal">
                    <table className="filter-table">
                        <tbody>
                        <tr>
                            <td><label htmlFor="genre-filter">Žanr:</label></td>
                            <td>
                                <div className="filter-options">
                                    <input type="checkbox" id="documentary" name="genre" value="Dokumentaal"
                                           checked={selectedGenres.includes("Dokumentaal")}
                                           onChange={handleGenreChange}/>
                                    <label htmlFor="documentary">Dokumentaal</label>
                                    <input type="checkbox" id="drama" name="genre" value="Draama"
                                           checked={selectedGenres.includes("Draama")}
                                           onChange={handleGenreChange}/>
                                    <label htmlFor="drama">Draama</label>
                                    <input type="checkbox" id="comedy" name="genre" value="Komöödia"
                                           checked={selectedGenres.includes("Komöödia")}
                                           onChange={handleGenreChange}/>
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
                                           checked={selectedAgeRatings.includes("0")}
                                           onChange={handleAgeRatingChange}/>
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
                                           checked={selectedLanguages.includes("ET")}
                                           onChange={handleLanguageChange}/>
                                    <label htmlFor="ET">eesti</label>
                                    <input type="checkbox" id="EN" name="language" value="EN"
                                           checked={selectedLanguages.includes("EN")}
                                           onChange={handleLanguageChange}/>
                                    <label htmlFor="EN">inglise</label>
                                    <input type="checkbox" id="ES" name="language" value="ES"
                                           checked={selectedLanguages.includes("ES")}
                                           onChange={handleLanguageChange}/>
                                    <label htmlFor="ES">hispaania</label>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button className={`custom-button ${isButtonPressed ? 'clicked' : ''}`}
                            onClick={handleSuggestByMostWatchedGenre}>
                        Soovita filme vaatamisajaloo põhjal
                    </button>
                    <button className="custom-button" onClick={handleRemovingFilters}>Eemalda filtrid</button>
                </div>
            )}
            {/* render movies for each day */}
            {generateDaysWithMovies().map((day, index) => (
                <div key={index} className="day-container">
                    <h2 className="day-header">{day.date}</h2>
                    <div className="movies-container">
                        <table className="movies-table">
                            <thead>
                            <tr>
                                <th>Pealkiri</th>
                                <th>Žanr</th>
                                <th>Vanusepiirang</th>
                                <th>Algus</th>
                                <th>Keel</th>
                                {/* show percentage column if enabled */}
                                {showPercentageColumn && <th>Sobivuse %</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {day.movies.map(movie => (
                                <tr key={movie.id}>
                                    <td>
                                        {/* link to movie booking page */}
                                        <Link to={`/movie/${movie.id}`} className="link-style"
                                              onClick={() => onSelectMovie(movie.id)}>{movie.title}</Link>
                                    </td>
                                    <td>{movie.genre}</td>
                                    <td>
                                        {movie.ageRating === 0 && 'Vanusepiirang puudub'}
                                        {movie.ageRating === 12 && 'K-12'}
                                        {movie.ageRating === 16 && 'K-16'}
                                        {movie.ageRating === 18 && 'K-18'}
                                    </td>
                                    <td>{formatStartTime(movie.startTime)}</td>
                                    <td>{movie.language}</td>
                                    {showPercentageColumn && <td>{movie.percentage}</td>}
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