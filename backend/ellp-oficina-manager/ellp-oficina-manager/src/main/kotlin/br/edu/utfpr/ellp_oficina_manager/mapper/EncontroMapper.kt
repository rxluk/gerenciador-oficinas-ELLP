package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.EncontroRecord
import br.edu.utfpr.ellp_oficina_manager.model.encontro.Encontro

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