package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.FrequenciaRecord
import br.edu.utfpr.ellp_oficina_manager.model.frequencia.Frequencia
import br.edu.utfpr.ellp_oficina_manager.model.frequencia.FrequenciaRequest
import br.edu.utfpr.ellp_oficina_manager.model.frequencia.FrequenciaResponse
import java.time.LocalDateTime

fun FrequenciaRecord.toModel(): Frequencia =
    Frequencia(
        id = this.id,
        matriculaId = this.matriculaId,
        encontroId = this.encontroId,
        presente = this.presente,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )

fun FrequenciaRequest.toModel() = Frequencia(
    id = 0,
    matriculaId = matriculaId,
    encontroId = encontroId,
    presente = presente,
    createdAt = LocalDateTime.now(),
    updatedAt = LocalDateTime.now(),
)

fun Frequencia.toResponse() = FrequenciaResponse(
    id = id,
    matriculaId = matriculaId,
    encontroId = encontroId,
    presente = presente,
)