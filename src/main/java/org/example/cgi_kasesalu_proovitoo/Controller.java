package org.example.cgi_kasesalu_proovitoo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class Controller {

    private final MovieRepository movieRepository;

    @Autowired
    public Controller(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/movies")
    public List<Movie> getMovies() {
        return movieRepository.findAll();
    }
}
