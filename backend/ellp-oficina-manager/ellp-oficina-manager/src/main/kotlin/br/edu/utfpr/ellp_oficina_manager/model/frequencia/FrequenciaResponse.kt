package br.edu.utfpr.ellp_oficina_manager.model.frequencia

data class FrequenciaResponse(
    val id: Long,
    val matriculaId: Long,
    val encontroId: Long,
    val presente: Boolean,
)