package br.edu.utfpr.ellp_oficina_manager.model.frequencia

import java.time.LocalDateTime

data class FrequenciaFilter(
    val id: Long? = null,
    val matriculaId: Long? = null,
    val encontroId: Long? = null,
    val presente: Boolean? = null,
)
