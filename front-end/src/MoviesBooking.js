import React, {useEffect, useState} from 'react';
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
            const maxRow = Math.max(...availableSeats.map(seat => seat.rowNr));
            const maxColumn = Math.max(...availableSeats.map(seat => seat.columnNr));
            const centerRow = Math.ceil(maxRow / 2);
            const centerColumn = Math.ceil(maxColumn / 2);

            //function to find the nearest available seats to the center
            const findNearestSeatsToCenter = (seats, centerRow, centerColumn, numberOfSeats) => {
                const availableSeats = seats.filter(seat => seat.availability);

                //sort available seats based on their distance from the center
                const sortedSeats = availableSeats.sort((a, b) => {
                    const distanceA = Math.abs(a.rowNr - centerRow) + Math.abs(a.columnNr - centerColumn);
                    const distanceB = Math.abs(b.rowNr - centerRow) + Math.abs(b.columnNr - centerColumn);
                    return distanceA - distanceB;
                });

                console.log(sortedSeats);
                //select the nearest available seats up to the required number
                return sortedSeats.slice(0, numberOfSeats);
            };

            console.log(centerRow);
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
        <>
            {!confirmationMessage && (
                <>
                    <h1 className="movies-title">Vali pileti arv:</h1>
                    <input type="number" value={ticketsSelected} onChange={handleTicketChange}/>
                    <h1 className="movies-title">Vali istekoht:</h1>
                    <div className="custom-hr">
                        <p className="label-screen">EKRAAN</p>
                    </div>
                    <div className="movies-seats">{renderSeats()}</div>
                    <button className="custom-button" onClick={handleConfirmSeats}>Kinnita valik</button>
                    <br></br>
                </>
            )}
            {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
            {confirmationError && <div className="error-message">{confirmationError}</div>}
            <button className="custom-button" onClick={handleReturnToMovies}>Tagasi filmide lehele</button>
        </>
    );

};

export default MoviesBooking;
