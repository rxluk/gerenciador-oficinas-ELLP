package br.edu.utfpr.ellp_oficina_manager.model.usuario

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Size

data class UsuarioRequest(
    @field:Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    val nome: String? = null,

    @field:Email(message = "Email inválido")
    val email: String? = null,

    @field:Size(min = 6, max = 50, message = "Senha deve ter entre 6 e 50 caracteres")
    val senha: String? = null,

    val provider: String? = null,
    val providerId: String? = null,
    val ativo: Boolean? = null,
)