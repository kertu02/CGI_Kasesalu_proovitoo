package org.example.cgi_kasesalu_proovitoo;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "app_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<WatchedMovie> watchedMovies = new ArrayList<>();

    public User() {
    }

    public User(String username) {
        this.username = username;
    }

    public void addWatchedMovie(Movie movie, List<Seat> selectedSeats) {
        // Check if the movie is already in the watchedMovies list
        WatchedMovie existingWatchedMovie = watchedMovies.stream()
                .filter(watchedMovie -> watchedMovie.getMovie().getId().equals(movie.getId()))
                .findFirst()
                .orElse(null);

        // If the movie exists, update the selected seats
        if (existingWatchedMovie != null) {
            existingWatchedMovie.setSelectedSeats(selectedSeats);
        } else {
            // If the movie doesn't exist in the list, then add it
            WatchedMovie watchedMovie = new WatchedMovie(movie, selectedSeats);
            watchedMovies.add(watchedMovie);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<WatchedMovie> getWatchedMovies() {
        return watchedMovies;
    }

    public void setWatchedMovies(List<WatchedMovie> watchedMovies) {
        this.watchedMovies = watchedMovies;
    }
}
