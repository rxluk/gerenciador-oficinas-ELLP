package br.edu.utfpr.ellp_oficina_manager.model.matricula

import java.time.LocalDate

data class MatriculaResponse(
    val id: Long,
    val alunoId: Long,
    val oficinaId: Long,
    val dataMatricula: LocalDate,
    val certificadoEmitido: Boolean,
)