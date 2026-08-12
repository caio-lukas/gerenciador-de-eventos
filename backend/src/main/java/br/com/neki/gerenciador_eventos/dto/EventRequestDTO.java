package br.com.neki.gerenciador_eventos.dto;

import java.time.LocalDateTime;

public record EventRequestDTO (
        String nome,
        LocalDateTime data,
        String localizacao,
        String descricao,
        String imagemUrl
) {
}
