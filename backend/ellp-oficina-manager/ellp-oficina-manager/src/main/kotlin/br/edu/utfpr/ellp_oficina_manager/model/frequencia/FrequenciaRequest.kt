package br.edu.utfpr.ellp_oficina_manager.model.frequencia

import jakarta.validation.constraints.NotNull

data class FrequenciaRequest(
    @field:NotNull(message = "Matrícula é obrigatória")
    val matriculaId: Long,

    @field:NotNull(message = "Encontro é obrigatório")
    val encontroId: Long,

    val presente: Boolean = false
)