package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.MatriculaRecord
import br.edu.utfpr.ellp_oficina_manager.model.matricula.Matricula
import br.edu.utfpr.ellp_oficina_manager.model.matricula.MatriculaRequest
import br.edu.utfpr.ellp_oficina_manager.model.matricula.MatriculaResponse
import java.time.LocalDateTime

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

fun MatriculaRequest.toModel() = Matricula(
    id = 0,
    alunoId = alunoId,
    oficinaId = oficinaId,
    dataMatricula = dataMatricula,
    certificadoEmitido = certificadoEmitido,
    createdAt = LocalDateTime.now(),
    updatedAt = LocalDateTime.now(),
)

fun Matricula.toResponse() = MatriculaResponse(
    id = id,
    alunoId = alunoId,
    oficinaId = oficinaId,
    dataMatricula = dataMatricula,
    certificadoEmitido = certificadoEmitido,
)