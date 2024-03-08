package org.example.cgi_kasesalu_proovitoo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MovieData implements CommandLineRunner {

    private final MovieRepository movieRepository;

    @Autowired
    public MovieData(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        movieRepository.save(new Movie("Selena Gomez: My Mind & Me", "Documentary", 18));
        movieRepository.save(new Movie("Black Mirror: Bandersnatch", "Sci-Fi", 18));
        movieRepository.save(new Movie("One Day", "Romance", 13));
    }
}
