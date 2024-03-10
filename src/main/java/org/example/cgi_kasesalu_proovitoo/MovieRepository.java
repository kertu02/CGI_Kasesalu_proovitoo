package org.example.cgi_kasesalu_proovitoo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findAllByOrderByStartTimeAsc();
}
