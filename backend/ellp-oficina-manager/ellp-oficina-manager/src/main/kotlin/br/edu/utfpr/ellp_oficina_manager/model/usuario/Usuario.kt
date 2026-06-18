package br.edu.utfpr.ellp_oficina_manager.model.usuario

import java.time.LocalDateTime

class Usuario(
    val id: Long? = null,
    val nome: String? = null,
    val email: String? = null,
    val senha: String? = null,
    val provider: String? = null,
    val providerId: String? = null,
    val ativo: Boolean? = true,
    val createdAt: LocalDateTime? = null,
    val updatedAt: LocalDateTime? = null,
)