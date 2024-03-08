package org.example.cgi_kasesalu_proovitoo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    //save(), findAll(), findById(), etc. are inherited from JpaRepository<Movie, Long>
}