package br.edu.utfpr.ellp_oficina_manager.model.certificado

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CertificadoRequest(
    @field:NotBlank(message = "Nome é obrigatório")
    @field:Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    val nome: String,

    @field:NotBlank(message = "Descrição é obrigatória")
    val descricao: String,

    @field:NotBlank(message = "Template é obrigatório")
    val template: String,

    val requerAssinatura: Boolean = false
)