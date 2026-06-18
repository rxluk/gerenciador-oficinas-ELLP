package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.EncontroRecord
import br.edu.utfpr.ellp_oficina_manager.model.encontro.Encontro
import br.edu.utfpr.ellp_oficina_manager.model.encontro.EncontroRequest
import br.edu.utfpr.ellp_oficina_manager.model.encontro.EncontroResponse
import java.time.LocalDateTime

fun EncontroRecord.toModel(): Encontro =
    Encontro(
        id = this.id,
        oficinaId = this.oficinaId,
        data = this.data,
        horarioInicio = this.horarioInicio,
        horarioFim = this.horarioFim,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )

fun EncontroRequest.toModel() = Encontro(
    id = 0,
    oficinaId = oficinaId,
    data = data,
    horarioInicio = horarioInicio,
    horarioFim = horarioFim,
    createdAt = LocalDateTime.now(),
    updatedAt = LocalDateTime.now(),
)

fun Encontro.toResponse() = EncontroResponse(
    id = id,
    oficinaId = oficinaId,
    data = data,
    horarioInicio = horarioInicio,
    horarioFim = horarioFim,
)