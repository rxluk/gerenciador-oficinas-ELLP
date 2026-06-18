package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.MatriculaRecord
import br.edu.utfpr.ellp_oficina_manager.model.matricula.Matricula

fun MatriculaRecord.toModel(): Matricula =
    Matricula(
        id = this.id,
        alunoId = this.alunoId,
        oficinaId = this.oficinaId,
        dataMatricula = this.dataMatricula,
        certificadoEmitido = this.certificadoEmitido,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )