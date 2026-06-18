package br.edu.utfpr.ellp_oficina_manager.model.oficina

data class OficinaFilter(
    val id: Long? = null,
    val professorId: Long? = null,
    val certificadoId: Long? = null,
    val titulo: String? = null,
    val sala: String? = null,
)
