package br.edu.utfpr.ellp_oficina_manager.model.aluno

import java.time.LocalDateTime

data class Aluno (
    val id: Long,
    val nome: String,
    val idade: Int,
    val serie: String,
    val telefone: String,
    val email: String,
    val endereco: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)