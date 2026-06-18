package br.edu.utfpr.ellp_oficina_manager.model.permission

import java.time.LocalDateTime

data class Permission(
    val id: Long? = null,
    val nome: String? = null,
    val createdAt: LocalDateTime? = null,
    val updatedAt: LocalDateTime? = null,
)