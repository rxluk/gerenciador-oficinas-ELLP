package br.edu.utfpr.ellp_oficina_manager.model.oficina

import java.time.LocalDate
import java.time.LocalDateTime

data class Oficina(
    val id: Long,
    val professorId: Long,
    val certificadoId: Long,
    val titulo: String,
    val descricao: String,
    val sala: String,
    val dataInicio: LocalDate,
    val dataFim: LocalDate,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)
