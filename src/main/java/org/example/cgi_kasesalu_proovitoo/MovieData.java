package org.example.cgi_kasesalu_proovitoo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class MovieData implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    @Autowired
    public MovieData(MovieRepository movieRepository, UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        //creating users
        userRepository.save(new User("user1"));
        userRepository.save(new User("user2"));

        //creating movies
        movieRepository.save(new Movie("Selena Gomez: My Mind & Me", "Dokumentaal", 18, LocalDateTime.parse("2024-03-29T20:45"), "EN"));
        movieRepository.save(new Movie("Black Mirror: Bandersnatch", "Ulme", 18, LocalDateTime.parse("2024-03-30T20:45"), "ES"));
        movieRepository.save(new Movie("Black Mirror: Bandersnatch", "Ulme", 18, LocalDateTime.parse("2024-03-29T16:00"), "EN"));
        movieRepository.save(new Movie("One Day", "Draama", 12, LocalDateTime.parse("2024-03-29T18:50"), "EN"));
        movieRepository.save(new Movie("One Day", "Draama", 12, LocalDateTime.parse("2024-03-29T22:30"), "ES"));
        movieRepository.save(new Movie("Kevade", "Draama", 0, LocalDateTime.parse("2024-03-29T17:00"), "ET"));
        movieRepository.save(new Movie("American Murder: The Family Next Door", "Dokumentaal", 16, LocalDateTime.parse("2024-03-29T22:00"), "EN"));
        movieRepository.save(new Movie("American Murder: The Family Next Door", "Dokumentaal", 16, LocalDateTime.parse("2024-03-30T21:00"), "EN"));
        movieRepository.save(new Movie("The Willoughbys", "Komöödia", 12, LocalDateTime.parse("2024-03-30T17:00"), "EN"));
        movieRepository.save(new Movie("The Willoughbys", "Komöödia", 12, LocalDateTime.parse("2024-04-01T17:30"), "ET"));
        movieRepository.save(new Movie("The Willoughbys", "Komöödia", 12, LocalDateTime.parse("2024-04-01T17:00"), "ES"));
        movieRepository.save(new Movie("American Murder: The Family Next Door", "Dokumentaal", 16, LocalDateTime.parse("2024-04-01T21:00"), "EN"));
        movieRepository.save(new Movie("The Willoughbys", "Komöödia", 12, LocalDateTime.parse("2024-04-01T18:25"), "ET"));
        movieRepository.save(new Movie("The Willoughbys", "Komöödia", 12, LocalDateTime.parse("2024-04-02T19:25"), "ET"));
        movieRepository.save(new Movie("American Murder: The Family Next Door", "Dokumentaal", 16, LocalDateTime.parse("2024-04-02T21:00"), "EN"));
        movieRepository.save(new Movie("American Murder: The Family Next Door", "Dokumentaal", 16, LocalDateTime.parse("2024-04-03T19:00"), "EN"));
    }
}
