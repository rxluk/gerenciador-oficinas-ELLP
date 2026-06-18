package br.edu.utfpr.ellp_oficina_manager.model.oficina

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDate

data class OficinaRequest(
    @field:NotNull(message = "Professor é obrigatório")
    val professorId: Long,

    @field:NotNull(message = "Certificado é obrigatório")
    val certificadoId: Long,

    @field:NotBlank(message = "Título é obrigatório")
    @field:Size(min = 2, max = 100, message = "Título deve ter entre 2 e 100 caracteres")
    val titulo: String,

    @field:NotBlank(message = "Descrição é obrigatória")
    val descricao: String,

    @field:NotBlank(message = "Sala é obrigatória")
    val sala: String,

    @field:NotNull(message = "Data de início é obrigatória")
    val dataInicio: LocalDate,

    @field:NotNull(message = "Data de fim é obrigatória")
    val dataFim: LocalDate,
)