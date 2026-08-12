package br.com.neki.gerenciador_eventos.dto;

import br.com.neki.gerenciador_eventos.entity.Event;

import java.time.LocalDateTime;

public record EventResponseDTO(
        Long id,
        String nome,
        LocalDateTime data,
        String localizacao,
        String descricao,
        String imagemUrl
) {
    public EventResponseDTO(Event event) {
        this(
                event.getId(),
                event.getNome(),
                event.getData(),
                event.getLocalizacao(),
                event.getDescricao(),
                event.getImagemUrl()
        );
    }
}
