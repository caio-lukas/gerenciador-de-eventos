package br.com.neki.gerenciador_eventos.controller;

import br.com.neki.gerenciador_eventos.dto.EventRequestDTO;
import br.com.neki.gerenciador_eventos.dto.EventResponseDTO;
import br.com.neki.gerenciador_eventos.service.EventService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
@CrossOrigin(origins = "*")
@SecurityRequirement(name = "bearerAuth")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<EventResponseDTO>> listarEventosDoAdmin(
            @PathVariable Long adminId,
            Authentication authentication) {

        return ResponseEntity.ok(eventService.listarPorAdminId(adminId, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<EventResponseDTO> cadastrarEvento(
            @RequestBody EventRequestDTO dto,
            Authentication authentication) {
        EventResponseDTO eventoSalvo = eventService.criarEvento(dto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(eventoSalvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody EventRequestDTO dto,
            Authentication authentication) {

        return ResponseEntity.ok(eventService.atualizarEvento(id, dto, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            Authentication authentication) {

        eventService.deletarEvento(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}