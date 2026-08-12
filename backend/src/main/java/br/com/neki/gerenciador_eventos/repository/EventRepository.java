package br.com.neki.gerenciador_eventos.repository;

import br.com.neki.gerenciador_eventos.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
