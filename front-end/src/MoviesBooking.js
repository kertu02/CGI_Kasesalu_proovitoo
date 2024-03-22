// functional component for booking movies
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const MoviesBooking = ({ movie, username, navigate }) => {
    // defining state variables using useState hook
    const [ticketsSelected, setTicketsSelected] = useState(1); // state for selected tickets
    const [seatSuggestions, setSeatSuggestions] = useState([]); // state for suggested seats
    const [confirmationMessage, setConfirmationMessage] = useState(''); // state for confirmation message
    const [confirmationError, setConfirmationError] = useState(''); // state for confirmation error
    const [seatsBooked, setSeatsBooked] = useState(false); // state for booked seats
    const [selectedSeats, setSelectedSeats] = useState([]); // state for selected seats
    const [isButtonPressed, setIsButtonPressed] = useState(false); // state for button press
    const [manualSelection, setManualSelection] = useState(false); // state for manual selection

    // function to toggle state of button press
    const togglePressableButton = () => {
        setManualSelection(prevState => !prevState);
        setIsButtonPressed(prevState => !prevState);
    };

    // effect hook to fetch available seats based on selected movie and tickets
    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/movies/${movie.id}/seats`);
                movie.seats = response.data; // Update movie.seats with fetched data
                const availableSeats = movie.seats.filter(seat => seat.availability);
                setSeatSuggestions(findConsecutiveSeats(availableSeats, ticketsSelected));
            } catch (error) {
                console.error('Error fetching seats:', error);
            }
        };
        fetchSeats();
    }, [movie, ticketsSelected]);

    // effect hook to generate seat suggestions based on manual selection
    useEffect(() => {
        const generateSeatSuggestions = () => {
            const availableSeats = movie.seats.filter(seat => seat.availability);
            let sortedSeats;
            sortedSeats = findConsecutiveSeats(availableSeats, ticketsSelected);
            setSeatSuggestions(sortedSeats);
            setSelectedSeats(sortedSeats); // set selectedSeats initially based on suggestions
        };

        if (!manualSelection) {
            generateSeatSuggestions();
        }
    }, [ticketsSelected, manualSelection, movie.seats]);

    // function to find consecutive available seats
    const findConsecutiveSeats = (availableSeats, tickets) => {
        const centerRow = Math.ceil(Math.max(...availableSeats.map(seat => seat.rowNr)) / 2);
        const centerColumn = Math.ceil(Math.max(...availableSeats.map(seat => seat.columnNr)) / 2);

        // sort seats based on distance from center
        availableSeats.sort((a, b) => {
            const distanceA = Math.abs(a.rowNr - centerRow) + Math.abs(a.columnNr - centerColumn);
            const distanceB = Math.abs(b.rowNr - centerRow) + Math.abs(b.columnNr - centerColumn);
            return distanceA - distanceB;
        });

        // find consecutive seats
        for (let i = 0; i < availableSeats.length; i++) {
            const currentSeat = availableSeats[i];
            const consecutiveSeats = [currentSeat];

            for (let j = 1; j < tickets; j++) {
                const nextSeat = availableSeats.find(seat => seat.rowNr === currentSeat.rowNr && seat.columnNr === currentSeat.columnNr + j);
                if (nextSeat) {
                    consecutiveSeats.push(nextSeat);
                } else {
                    break; // break if consecutive seat not found
                }
            }

            if (consecutiveSeats.length === tickets) {
                return consecutiveSeats;
            }
        }

        // if consecutive seats not found, return seats closest to the center
        return availableSeats.slice(0, tickets);
    };

    // function to handle seat selection
    const handleSeatSelect = (row, column) => {
        if (manualSelection) {
            const isSelected = selectedSeats.some(seat => seat.rowNr === row && seat.columnNr === column);
            const seatIndex = selectedSeats.findIndex(seat => seat.rowNr === row && seat.columnNr === column);

            if (!isSelected) {
                setSelectedSeats([...selectedSeats, {rowNr: row, columnNr: column}]);
            } else {
                const updatedSelectedSeats = [...selectedSeats];
                updatedSelectedSeats.splice(seatIndex, 1);
                setSelectedSeats(updatedSelectedSeats);
            }
        }
    };

    // function to render seats
    const renderSeats = () => {
        return movie.seats.map(seat => (
            <input
                key={`${seat.rowNr}-${seat.columnNr}`}
                type="checkbox"
                checked={manualSelection ? selectedSeats.some(selectedSeat => selectedSeat.rowNr === seat.rowNr && selectedSeat.columnNr === seat.columnNr) : seatSuggestions.some(selectedSeat => selectedSeat.rowNr === seat.rowNr && selectedSeat.columnNr === seat.columnNr)}
                onChange={() => handleSeatSelect(seat.rowNr, seat.columnNr)}
                disabled={!seat.availability || (seatsBooked && !selectedSeats.some(selectedSeat => selectedSeat.rowNr === seat.rowNr && selectedSeat.columnNr === seat.columnNr))}
            />
        ));
    };

    // function to handle seat confirmation
    const handleConfirmSeats = async () => {
        if (!seatsBooked) {
            try {
                const response = await axios.put(`http://localhost:8080/movies/${movie.id}/seats`, selectedSeats.map(seat => ({ rowNr: seat.rowNr, columnNr: seat.columnNr })));

                if (response.status === 200) {
                    await axios.put(`http://localhost:8080/users/${username}/watchedMovies/${movie.id}`, selectedSeats.map(seat => ({ rowNr: seat.rowNr, columnNr: seat.columnNr })));
                    setConfirmationMessage('Valitud kohad kinnitatud! Palun pöördu tagasi filmide lehele.');
                    console.log(response);
                    setConfirmationError('');
                    setSeatsBooked(true);
                } else {
                    setConfirmationError('Kohtade kinnitamine ebaõnnestus. Palun proovi uuesti.');
                    setConfirmationMessage('');
                }
            } catch (error) {
                setConfirmationError('Kohtade kinnitamine ebaõnnestus. Palun proovi uuesti.');
                setConfirmationMessage('');
            }
        }
    };

    // function to handle return to movies page
    const handleReturnToMovies = async () => {
        navigate('/movies');
    };

    // function to handle tickets change
    const handleTicketsChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= movie.seats.filter(seat => seat.availability).length) {
            setTicketsSelected(value);
        }
    };

    // function to handle manual seat selection
    const handleManualSelection = () => {
        togglePressableButton();
    };

    return (
        <>
            {!confirmationMessage && (
                <>
                    <h1 className="movies-title">Valitud film: {movie.title}</h1>
                    {!manualSelection && <p>Vali pileti arv:</p>}
                    {!manualSelection &&
                        <input type="number" value={ticketsSelected} onChange={handleTicketsChange} min="1"
                               max={movie.seats.filter(seat => seat.availability).length}/>}
                    <p>Vali istekoht:</p>
                    <div className="custom-hr">
                        <p className="label-screen">EKRAAN</p>
                    </div>
                    <div className="movies-seats">{renderSeats()}</div>
                    <button className={`custom-button ${isButtonPressed ? 'clicked' : ''}`}
                            onClick={handleManualSelection}>Vali kohad manuaalselt
                    </button>
                    <br/>
                </>
            )}
            {confirmationMessage && <p>{confirmationMessage}</p>}
            {confirmationError && <p>{confirmationError}</p>}
            <div>
                {!confirmationMessage &&
                    <button className="custom-button" onClick={handleConfirmSeats}>Kinnita valik</button>}
                <button className="custom-button" onClick={handleReturnToMovies}>Tagasi filmide lehele</button>
            </div>
        </>
    );
};

export default MoviesBooking;
