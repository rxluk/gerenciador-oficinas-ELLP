package br.edu.utfpr.ellp_oficina_manager.model.frequencia

import java.time.LocalDateTime

data class Frequencia(
    val id: Long,
    val matriculaId: Long,
    val encontroId: Long,
    val presente: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)
