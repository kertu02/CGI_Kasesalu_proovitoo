import React, {useState, useEffect} from 'react';
import axios from 'axios';

const MoviesBooking = ({movie, username, navigate}) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [ticketsSelected, setTicketsSelected] = useState(1);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [confirmationError, setConfirmationError] = useState('');
    const [seatsBooked, setSeatsBooked] = useState(false);

    const handleSeatSelect = (row, column) => {
        if (!seatsBooked) {
            const seatIndex = selectedSeats.findIndex(seat => seat.rowNr === row && seat.columnNr === column);
            if (seatIndex !== -1) {
                setSelectedSeats(prevSeats => prevSeats.filter((seat, index) => index !== seatIndex));
            } else {
                setSelectedSeats(prevSeats => [...prevSeats, {rowNr: row, columnNr: column}]);
            }
        }
    };

    useEffect(() => {
        if (!seatsBooked) {
            const availableSeats = movie.seats.filter(seat => seat.availability);

            // Calculate center row and column
            const centerRow = Math.ceil(movie.rows / 2);
            const centerColumn = Math.ceil(movie.columns / 2);

            // Function to find the nearest available seats to the center
            const findNearestSeatsToCenter = (seats, centerRow, centerColumn, numberOfSeats) => {
                const nearestSeats = [];
                seats.forEach(seat => {
                    // Calculate distance from the center for each seat
                    const distance = Math.abs(seat.rowNr - centerRow) + Math.abs(seat.columnNr - centerColumn);
                    nearestSeats.push({seat, distance});
                });

                // Sort seats based on their distance from the center
                nearestSeats.sort((a, b) => a.distance - b.distance);

                // Select the nearest available seats
                const selectedSeats = [];
                for (let i = 0; i < numberOfSeats; i++) {
                    if (nearestSeats[i] && nearestSeats[i].seat.availability) {
                        selectedSeats.push(nearestSeats[i].seat);
                    } else {
                        break;
                    }
                }

                return selectedSeats;
            };

            const suggestedSeats = findNearestSeatsToCenter(availableSeats, centerRow, centerColumn, ticketsSelected);
            setSelectedSeats(suggestedSeats);
        }
    }, [ticketsSelected, movie.rows, movie.columns, movie.seats, seatsBooked]);

    const renderSeats = () => {
        return movie.seats.map(seat => (
            <input
                key={`${seat.rowNr}-${seat.columnNr}`}
                type="checkbox"
                checked={selectedSeats.some(selectedSeat => selectedSeat.rowNr === seat.rowNr && selectedSeat.columnNr === seat.columnNr)}
                onChange={() => handleSeatSelect(seat.rowNr, seat.columnNr)}
                disabled={!seat.availability || seatsBooked}
            />
        ));
    };

    const handleConfirmSeats = async () => {
        if (!seatsBooked) {
            try {
                const response = await axios.put(`http://localhost:8080/movies/${movie.id}/seats`, selectedSeats);

                if (response.status === 200) {
                    await axios.put(`http://localhost:8080/users/${username}/watched-movies`, movie);
                    setConfirmationMessage('Valitud kohad kinnitatud! Palun pöördu tagasi filmide lehele.');
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

    const handleTicketChange = (e) => {
        if (!seatsBooked) {
            const value = parseInt(e.target.value);
            const availableSeatsCount = movie.seats.filter(seat => seat.availability).length;
            if (!isNaN(value) && value >= 0 && value <= availableSeatsCount) {//min available seats
                setTicketsSelected(value);
            } else if (value > availableSeatsCount) {
                setTicketsSelected(availableSeatsCount); //max available seats
            }
        }
    };

    const handleReturnToMovies = () => {
        navigate('/movies');
    };

    return (
        <div>
            {!confirmationMessage && <h1 className="movies-title">Vali pileti arv:</h1>}
            {!confirmationMessage &&<input type="number" value={ticketsSelected} onChange={handleTicketChange}/>}
            {!confirmationMessage &&<h1 className="movies-title">Vali istekoht:</h1>}
            {!confirmationMessage && <div className="custom-hr"><p className="label-screen">EKRAAN</p></div>}
            {!confirmationMessage && <div className="movies-seats">{renderSeats()}</div>}
            {!confirmationMessage && <button className="custom-button" onClick={handleConfirmSeats}>Kinnita valik</button>}
            {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
            {confirmationError && <div className="error-message">{confirmationError}</div>}
            <button className="custom-button" onClick={handleReturnToMovies}>Tagasi filmide lehele</button>
        </div>
    );

};

export default MoviesBooking;
