package org.example.cgi_kasesalu_proovitoo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    Movie findMovieById(Long id);
    List<Movie> findAllByOrderByStartTimeAsc();
}
