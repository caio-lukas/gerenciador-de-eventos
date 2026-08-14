package br.com.neki.gerenciador_eventos.repository;

import br.com.neki.gerenciador_eventos.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByAdminId(Long adminId);
}
