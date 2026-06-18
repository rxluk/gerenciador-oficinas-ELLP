package br.edu.utfpr.ellp_oficina_manager.model.matricula

import jakarta.validation.constraints.NotNull
import java.time.LocalDate

data class MatriculaRequest(
    @field:NotNull(message = "Aluno é obrigatório")
    val alunoId: Long,

    @field:NotNull(message = "Oficina é obrigatória")
    val oficinaId: Long,

    @field:NotNull(message = "Data de matrícula é obrigatória")
    val dataMatricula: LocalDate,

    val certificadoEmitido: Boolean = false
)