package br.edu.utfpr.ellp_oficina_manager.model.encontro

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

data class Encontro(
    val id: Long,
    val oficinaId: Long,
    val data: LocalDate,
    val horarioInicio: LocalTime,
    val horarioFim: LocalTime,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)