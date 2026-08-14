package br.com.neki.gerenciador_eventos.service;

import br.com.neki.gerenciador_eventos.dto.EventRequestDTO;
import br.com.neki.gerenciador_eventos.dto.EventResponseDTO;
import br.com.neki.gerenciador_eventos.entity.Admin;
import br.com.neki.gerenciador_eventos.entity.Event;
import br.com.neki.gerenciador_eventos.repository.AdminRepository;
import br.com.neki.gerenciador_eventos.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AdminRepository adminRepository;

    // CRIAR EVENTO
    public EventResponseDTO criarEvento(EventRequestDTO dto, String emailAdminLogado) {
        Admin admin = adminRepository.findByEmail(emailAdminLogado)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Admin autenticado não encontrado."));
        Event evento = new Event();
        evento.setNome(dto.nome());
        evento.setData(dto.data());
        evento.setLocalizacao(dto.localizacao());
        evento.setDescricao(dto.descricao());
        evento.setImagemUrl(dto.imagemUrl());
        evento.setAdmin(admin);
        return new EventResponseDTO(eventRepository.save(evento));
    }

    // LISTAR POR ADMIN ID
    public List<EventResponseDTO> listarPorAdminId(Long adminId, String emailAdminLogado) {
        Admin adminLogado = adminRepository.findByEmail(emailAdminLogado)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin não encontrado."));

        // Verifica se o ID da URL é o mesmo ID do dono do token
        if (!adminLogado.getId().equals(adminId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para visualizar os eventos de outro administrador.");
        }

        // Se passou pela segurança, devolve a lista
        return eventRepository.findByAdminId(adminId).stream()
                .map(EventResponseDTO::new)
                .toList();
    }

    // ATUALIZAR EVENTO
    public EventResponseDTO atualizarEvento(Long id, EventRequestDTO dto, String emailAdminLogado) {
        Event evento = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado com o ID: " + id));

        // Verifica se o e-mail do dono do evento é igual ao e-mail de quem pediu a alteração
        if (!evento.getAdmin().getEmail().equals(emailAdminLogado)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para editar este evento.");
        }

        evento.setData(dto.data());
        evento.setLocalizacao(dto.localizacao());

        Event eventoAtualizado = eventRepository.save(evento);
        return new EventResponseDTO(eventoAtualizado);
    }

    // DELETAR EVENTO
    public void deletarEvento(Long id, String emailAdminLogado) {
        Event evento = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado com o ID: " + id));

        if (!evento.getAdmin().getEmail().equals(emailAdminLogado)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para excluir este evento.");
        }

        eventRepository.delete(evento);
    }
}