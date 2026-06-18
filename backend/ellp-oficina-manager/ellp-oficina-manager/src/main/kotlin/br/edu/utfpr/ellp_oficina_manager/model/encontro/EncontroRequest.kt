package br.edu.utfpr.ellp_oficina_manager.model.encontro

import jakarta.validation.constraints.NotNull
import java.time.LocalDate
import java.time.LocalTime

data class EncontroRequest(
    @field:NotNull(message = "Oficina é obrigatória")
    val oficinaId: Long,

    @field:NotNull(message = "Data é obrigatória")
    val data: LocalDate,

    @field:NotNull(message = "Horário de início é obrigatório")
    val horarioInicio: LocalTime,

    @field:NotNull(message = "Horário de fim é obrigatório")
    val horarioFim: LocalTime,
)