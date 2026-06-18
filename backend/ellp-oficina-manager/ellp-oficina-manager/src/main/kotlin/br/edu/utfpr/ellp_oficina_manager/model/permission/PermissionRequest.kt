package br.edu.utfpr.ellp_oficina_manager.model.permission

import jakarta.validation.constraints.NotBlank

data class PermissionRequest(
    @field:NotBlank(message = "Nome é obrigatório")
    val nome: String,
)