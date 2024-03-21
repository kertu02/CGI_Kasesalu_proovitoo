package org.example.cgi_kasesalu_proovitoo;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class WatchedMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Movie movie;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Seat> selectedSeats = new ArrayList<>();

    public WatchedMovie() {
    }

    public WatchedMovie(Long id, Movie movie, List<Seat> selectedSeats) {
        this.id = id;
        this.movie = movie;
        this.selectedSeats = selectedSeats;
    }

    public WatchedMovie(Movie movie, List<Seat> selectedSeats) {
        this.movie = movie;
        this.selectedSeats = selectedSeats;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public List<Seat> getSelectedSeats() {
        return selectedSeats;
    }

    public void setSelectedSeats(List<Seat> selectedSeats) {
        this.selectedSeats = selectedSeats;
    }
}
