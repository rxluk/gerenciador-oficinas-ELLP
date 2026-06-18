package br.edu.utfpr.ellp_oficina_manager.model.certificado

data class CertificadoResponse(
    val id: Long,
    val nome: String,
    val descricao: String,
    val template: String,
    val requerAssinatura: Boolean,
)