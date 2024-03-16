package org.example.cgi_kasesalu_proovitoo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class Controller {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    @Autowired
    public Controller(MovieRepository movieRepository, UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/movies")
    public List<Movie> getMovies() {
        return movieRepository.findAllByOrderByStartTimeAsc();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/users/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/movies/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        return movieRepository.findById(id)
                .map(movie -> {
                    // Update movie properties with the values from updatedMovie
                    movie.setTitle(updatedMovie.getTitle());
                    movie.setGenre(updatedMovie.getGenre());
                    movie.setAgeRating(updatedMovie.getAgeRating());
                    movie.setStartTime(updatedMovie.getStartTime());
                    movie.setLanguage(updatedMovie.getLanguage());

                    // Save the updated movie to the database
                    return ResponseEntity.ok(movieRepository.save(movie));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/movies/{id}/seats")
    public ResponseEntity<Movie> updateMovieSeats(@PathVariable Long id, @RequestBody List<Seat> selectedSeats) {
        return movieRepository.findById(id)
                .map(movie -> {
                    // Book the selected seats
                    movie.bookSeats(selectedSeats);

                    // Save the updated movie to the database
                    return ResponseEntity.ok(movieRepository.save(movie));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/users/{username}/watched-movies")
    public ResponseEntity<User> updateWatchedMovies(@PathVariable String username, @RequestBody Movie watchedMovie) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            user.addWatchedMovie(watchedMovie);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
