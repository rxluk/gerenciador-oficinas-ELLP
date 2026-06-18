package br.edu.utfpr.ellp_oficina_manager.model.aluno

data class AlunoResponse(
    val id: Long,
    val nome: String,
    val idade: Int?,
    val serie: String?,
    val telefone: String?,
    val email: String?,
    val endereco: String?
)