package br.edu.utfpr.ellp_oficina_manager.model.certificado

import java.time.LocalDateTime

data class Certificado(
    val id: Long,
    val nome: String,
    val descricao: String,
    val requerAssinatura: Boolean,
    val template: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)
