package br.com.neki.gerenciador_eventos.service;

import br.com.neki.gerenciador_eventos.dto.EventRequestDTO;
import br.com.neki.gerenciador_eventos.dto.EventResponseDTO;
import br.com.neki.gerenciador_eventos.entity.Event;
import br.com.neki.gerenciador_eventos.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public EventResponseDTO criarEvento(EventRequestDTO dto) {
        Event evento = new Event();
        evento.setNome(dto.nome());
        evento.setData(dto.data());
        evento.setLocalizacao(dto.localizacao());
        evento.setDescricao(dto.descricao());
        evento.setImagemUrl(dto.imagemUrl());

        Event eventoSalvo = eventRepository.save(evento);
        return new EventResponseDTO(eventoSalvo);
    }

    public List<EventResponseDTO> listarTodo() {
        return eventRepository.findAll().stream()
                .map(EventResponseDTO::new)
                .toList();
    }

    public EventResponseDTO buscarPorId(Long id) {
        Event evento = buscarOuFalhar(id);
        return new EventResponseDTO(evento);
    }

    public EventResponseDTO atualizarEvento(Long id, EventRequestDTO dto) {
        Event evento = buscarOuFalhar(id);

        evento.setNome(dto.nome());
        evento.setData(dto.data());
        evento.setLocalizacao(dto.localizacao());
        evento.setDescricao(dto.descricao());
        evento.setImagemUrl(dto.imagemUrl());

        Event eventoAtualizado = eventRepository.save(evento);
        return new EventResponseDTO(eventoAtualizado);
    }

    public void deletarEvento(Long id) {
        Event evento = buscarOuFalhar(id);
        eventRepository.delete(evento);
    }

    // Função auxiliar para evitar repetição de código
    public Event buscarOuFalhar(Long id) {
        Event evento = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado com o ID: " + id));
        return evento;
    }
}
