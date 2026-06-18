package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.OficinaRecord
import br.edu.utfpr.ellp_oficina_manager.model.oficina.Oficina
import br.edu.utfpr.ellp_oficina_manager.model.oficina.OficinaRequest
import br.edu.utfpr.ellp_oficina_manager.model.oficina.OficinaResponse
import java.time.LocalDateTime

fun OficinaRecord.toModel(): Oficina =
    Oficina(
        id = this.id,
        professorId = this.professorId,
        certificadoId = this.certificadoId,
        titulo = this.titulo,
        descricao = this.descricao,
        sala = this.sala,
        dataInicio = this.dataInicio,
        dataFim = this.dataFim,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )

fun OficinaRequest.toModel() = Oficina(
    id = 0,
    professorId = professorId,
    certificadoId = certificadoId,
    titulo = titulo,
    descricao = descricao,
    sala = sala,
    dataInicio = dataInicio,
    dataFim = dataFim,
    createdAt = LocalDateTime.now(),
    updatedAt = LocalDateTime.now(),
)

fun Oficina.toResponse() = OficinaResponse(
    id = id,
    professorId = professorId,
    certificadoId = certificadoId,
    titulo = titulo,
    descricao = descricao,
    sala = sala,
    dataInicio = dataInicio,
    dataFim = dataFim,
)