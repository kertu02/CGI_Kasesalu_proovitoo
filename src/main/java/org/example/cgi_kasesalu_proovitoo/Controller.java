package org.example.cgi_kasesalu_proovitoo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class Controller {


    @PersistenceContext
    private EntityManager entityManager;

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
        User user = userRepository.findUserByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/movies/{id}")
    public ResponseEntity<Movie> getMovie(@PathVariable Long id) {
        Movie movie = movieRepository.findMovieById(id);
        if (movie != null) {
            return ResponseEntity.ok(movie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/movies/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        Optional<Movie> optionalMovie = movieRepository.findById(id);
        if (optionalMovie.isPresent()) {
            Movie movie = optionalMovie.get();
            // Update movie properties with the values from updatedMovie
            movie.setTitle(updatedMovie.getTitle());
            movie.setGenre(updatedMovie.getGenre());
            movie.setAgeRating(updatedMovie.getAgeRating());
            movie.setStartTime(updatedMovie.getStartTime());
            movie.setLanguage(updatedMovie.getLanguage());

            // Use EntityManager to merge changes into the managed entity
            entityManager.merge(movie);

            return ResponseEntity.ok(movie);
        } else {
            return ResponseEntity.notFound().build();
        }
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
    @GetMapping("/movies/{id}/seats")
    public ResponseEntity<List<Seat>> getMovieSeats(@PathVariable Long id) {
        Optional<Movie> optionalMovie = movieRepository.findById(id);
        if (optionalMovie.isPresent()) {
            Movie movie = optionalMovie.get();
            List<Seat> seats = movie.getSeats();
            return ResponseEntity.ok(seats);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/users/{username}/watchedMovies/{movieId}/seats")
    public ResponseEntity<List<Seat>> getWatchedMovieSeats(@PathVariable String username, @PathVariable Long movieId) {
        User user = userRepository.findUserByUsername(username);
        if (user != null) {
            Optional<WatchedMovie> optionalWatchedMovie = user.getWatchedMovies().stream()
                    .filter(watchedMovie -> watchedMovie.getMovie().getId().equals(movieId))
                    .findFirst();
            if (optionalWatchedMovie.isPresent()) {
                WatchedMovie watchedMovie = optionalWatchedMovie.get();
                List<Seat> watchedSeats = watchedMovie.getSelectedSeats();
                return ResponseEntity.ok(watchedSeats);
            } else {
                return ResponseEntity.notFound().build(); // Watched movie not found for the user
            }
        } else {
            return ResponseEntity.notFound().build(); // User not found
        }
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/users/{username}/watchedMovies/{movieId}")
    public ResponseEntity<User> updateWatchedMovies(@PathVariable String username, @PathVariable Long movieId, @RequestBody List<Seat> selectedSeats) {
        // Find the user by username
        User user = userRepository.findUserByUsername(username);
        if (user != null) {
            Optional<Movie> optionalMovie = movieRepository.findById(movieId);
            if (optionalMovie.isPresent()) {
                Movie watchedMovie = optionalMovie.get();
                user.addWatchedMovie(watchedMovie, selectedSeats);
                userRepository.save(user);
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/users/{username}/watchedMovies")
    public ResponseEntity<List<WatchedMovie>> getWatchedMoviesByUser(@PathVariable String username) {
        User user = userRepository.findUserByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user.getWatchedMovies());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
