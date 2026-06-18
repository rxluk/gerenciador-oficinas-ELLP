package br.edu.utfpr.ellp_oficina_manager.model.aluno

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Size

data class AlunoRequest(
    @field:NotBlank(message = "Nome é obrigatório")
    @field:Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    val nome: String,

    @field:Min(value = 1, message = "Idade inválida")
    val idade: Int?,

    @field:Size(max = 20, message = "Série deve ter no máximo 20 caracteres")
    val serie: String?,

    @field:Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    val telefone: String?,

    @field:Email(message = "Email inválido")
    val email: String?,

    val endereco: String?
)