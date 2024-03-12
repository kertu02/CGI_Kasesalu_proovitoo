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

    @OneToMany(fetch = FetchType.EAGER)
    private List<Movie> watchedMovies = new ArrayList<>();

    public User() {
    }

    public User(String username) {
        this.username = username;
    }

    public void addWatchedMovie(Movie movie) {
        watchedMovies.add(movie);
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

    public List<Movie> getWatchedMovies() {
        return watchedMovies;
    }

    public void setWatchedMovies(List<Movie> watchedMovies) {
        this.watchedMovies = watchedMovies;
    }
}
