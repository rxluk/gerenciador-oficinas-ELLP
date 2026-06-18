package br.edu.utfpr.ellp_oficina_manager.model.usuario

data class UsuarioResponse(
    val id: Long,
    val nome: String?,
    val email: String?,
    val ativo: Boolean?,
)