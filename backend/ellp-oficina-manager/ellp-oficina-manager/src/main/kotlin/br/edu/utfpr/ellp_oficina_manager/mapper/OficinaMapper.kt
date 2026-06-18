package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.OficinaRecord
import br.edu.utfpr.ellp_oficina_manager.model.oficina.Oficina

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
