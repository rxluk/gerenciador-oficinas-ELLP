package br.edu.utfpr.ellp_oficina_manager.model.usuario

data class UsuarioFilter(
    val id: Long? = null,
    val nome: String? = null,
    val email: String? = null,
    val provider: String? = null,
    val ativo: Boolean? = null,
)