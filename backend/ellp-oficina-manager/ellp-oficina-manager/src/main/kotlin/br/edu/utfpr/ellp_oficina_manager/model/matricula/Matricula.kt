package br.edu.utfpr.ellp_oficina_manager.model.matricula

import java.time.LocalDate
import java.time.LocalDateTime

data class Matricula(
    val id: Long,
    val alunoId: Long,
    val oficinaId: Long,
    val dataMatricula: LocalDate,
    val certificadoEmitido: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)
