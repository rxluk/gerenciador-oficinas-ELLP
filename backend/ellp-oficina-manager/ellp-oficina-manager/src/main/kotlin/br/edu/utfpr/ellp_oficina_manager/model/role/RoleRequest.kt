package br.edu.utfpr.ellp_oficina_manager.model.role

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RoleRequest(
    @field:NotBlank(message = "Nome é obrigatório")
    @field:Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    val nome: String,
)