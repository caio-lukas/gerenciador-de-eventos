package br.com.neki.gerenciador_eventos.controller;

import br.com.neki.gerenciador_eventos.dto.EventRequestDTO;
import br.com.neki.gerenciador_eventos.dto.EventResponseDTO;
import br.com.neki.gerenciador_eventos.service.EventService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
@CrossOrigin(origins = "*")
@SecurityRequirement(name = "bearerAuth")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponseDTO> criar(@RequestBody EventRequestDTO dto) {
        EventResponseDTO evento = eventService.criarEvento(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(evento);
    }

    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> listar() {
        return ResponseEntity.ok(eventService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDTO> atualizar(@PathVariable Long id, @RequestBody EventRequestDTO dto) {
        return ResponseEntity.ok(eventService.atualizarEvento(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        eventService.deletarEvento(id);
        return ResponseEntity.noContent().build();
    }
}
