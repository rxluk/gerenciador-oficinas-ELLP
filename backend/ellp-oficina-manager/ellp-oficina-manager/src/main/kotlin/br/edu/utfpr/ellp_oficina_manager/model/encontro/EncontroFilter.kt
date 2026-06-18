package br.edu.utfpr.ellp_oficina_manager.model.encontro

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

data class EncontroFilter(
    val id: Long? = null,
    val oficinaId: Long? = null,
    val data: LocalDate? = null,
)
