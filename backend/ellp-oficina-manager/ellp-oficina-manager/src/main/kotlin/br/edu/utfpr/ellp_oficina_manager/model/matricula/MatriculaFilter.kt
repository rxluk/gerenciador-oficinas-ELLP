package br.edu.utfpr.ellp_oficina_manager.model.matricula

import java.time.LocalDate
import java.time.LocalDateTime

data class MatriculaFilter(
    val id: Long? = null,
    val alunoId: Long? = null,
    val oficinaId: Long? = null,
    val certificadoEmitido: Boolean? = null,
)
