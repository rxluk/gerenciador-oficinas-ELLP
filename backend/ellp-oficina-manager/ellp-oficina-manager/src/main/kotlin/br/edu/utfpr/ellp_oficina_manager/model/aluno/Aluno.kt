package br.edu.utfpr.ellp_oficina_manager.model.aluno

import java.time.LocalDateTime

data class Aluno (
    val id: Long? = null,
    val nome: String? = null,
    val idade: Int? = null,
    val serie: String? = null,
    val telefone: String? = null,
    val email: String? = null,
    val endereco: String? = null,
    val createdAt: LocalDateTime? = null,
    val updatedAt: LocalDateTime? = null,
)