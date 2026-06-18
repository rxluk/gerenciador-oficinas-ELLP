package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.FrequenciaRecord
import br.edu.utfpr.ellp_oficina_manager.model.frequencia.Frequencia

fun FrequenciaRecord.toModel(): Frequencia =
    Frequencia(
        id = this.id,
        matriculaId = this.matriculaId,
        encontroId = this.encontroId,
        presente = this.presente,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )