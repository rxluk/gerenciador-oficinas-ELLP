package br.edu.utfpr.ellp_oficina_manager.model.role

import java.time.LocalDateTime

data class Role(
    val id: Long? = null,
    val nome: String? = null,
    val createdAt: LocalDateTime? = null,
    val updatedAt: LocalDateTime? = null,
)