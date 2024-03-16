package org.example.cgi_kasesalu_proovitoo;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Seat> seats = new ArrayList<>();

    private String title;
    private String genre;
    private int ageRating;
    private LocalDateTime startTime;
    private String language;

    public void bookSeats(List<Seat> selectedSeats) {
        for (Seat selectedSeat : selectedSeats) {
            for (Seat seat : seats) {
                if (seat.getRowNr() == selectedSeat.getRowNr() && seat.getColumnNr() == selectedSeat.getColumnNr()) {
                    seat.setAvailability(false); //mark the seat as unavailable
                    break;
                }
            }
        }
    }

    // Constructors
    public Movie() {
    }

    public Movie(String title, String genre, int ageRating, LocalDateTime startTime, String language) {
        this.title = title;
        this.genre = genre;
        this.ageRating = ageRating;
        this.startTime = startTime;
        this.language = language;
        generateSeats();
    }

    //randomly generated default seating situation
    private void generateSeats() {
        int totalRows = 5;//these could be randomized as well if we want random room sizes, but for now it is always 10x5 for simplicity
        int totalColumns = 10;

        Random random = new Random();
        for (int row = 1; row <= totalRows; row++) {
            for (int column = 1; column <= totalColumns; column++) {
                boolean isAvailable = random.nextBoolean();
                Seat seat = new Seat(isAvailable, row, column);
                seats.add(seat);
            }
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public int getAgeRating() {
        return ageRating;
    }

    public void setAgeRating(int ageRating) {
        this.ageRating = ageRating;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<Seat> getSeats() {
        return seats;
    }

    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
}
