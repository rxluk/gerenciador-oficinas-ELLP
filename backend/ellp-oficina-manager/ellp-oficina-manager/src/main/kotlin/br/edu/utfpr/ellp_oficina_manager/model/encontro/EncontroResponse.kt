package br.edu.utfpr.ellp_oficina_manager.model.encontro

import java.time.LocalDate
import java.time.LocalTime

data class EncontroResponse(
    val id: Long,
    val oficinaId: Long,
    val data: LocalDate,
    val horarioInicio: LocalTime,
    val horarioFim: LocalTime,
)