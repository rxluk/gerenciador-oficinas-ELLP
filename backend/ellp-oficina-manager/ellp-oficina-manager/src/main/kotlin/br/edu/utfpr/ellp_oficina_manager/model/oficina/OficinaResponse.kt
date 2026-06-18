package br.edu.utfpr.ellp_oficina_manager.model.oficina

import java.time.LocalDate

data class OficinaResponse(
    val id: Long,
    val professorId: Long,
    val certificadoId: Long,
    val titulo: String,
    val descricao: String,
    val sala: String,
    val dataInicio: LocalDate,
    val dataFim: LocalDate,
)