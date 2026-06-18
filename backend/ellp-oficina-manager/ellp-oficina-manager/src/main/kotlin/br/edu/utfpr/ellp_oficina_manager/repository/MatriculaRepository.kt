package br.edu.utfpr.ellp_oficina_manager.repository

import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.MATRICULA
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.model.matricula.Matricula
import br.edu.utfpr.ellp_oficina_manager.model.matricula.MatriculaFilter
import org.jooq.Condition
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class MatriculaRepository(
    private val dsl: DSLContext
) {

    fun findAll(): List<Matricula> =
        dsl.selectFrom(MATRICULA)
            .fetch()
            .map { it.toModel() }

    fun findByFields(filter: MatriculaFilter): List<Matricula> {
        val conditions = mutableListOf<Condition>()

        filter.id?.let { conditions += MATRICULA.ID.eq(it) }
        filter.alunoId?.let { conditions += MATRICULA.ALUNO_ID.eq(it) }
        filter.oficinaId?.let { conditions += MATRICULA.OFICINA_ID.eq(it) }
        filter.certificadoEmitido?.let { conditions += MATRICULA.CERTIFICADO_EMITIDO.eq(it) }

        return dsl.selectFrom(MATRICULA)
            .where(conditions)
            .fetch()
            .map { it.toModel() }
    }

    fun insert(matricula: Matricula): Matricula? =
        dsl.insertInto(MATRICULA)
            .set(MATRICULA.ALUNO_ID, matricula.alunoId)
            .set(MATRICULA.OFICINA_ID, matricula.oficinaId)
            .set(MATRICULA.DATA_MATRICULA, matricula.dataMatricula)
            .set(MATRICULA.CERTIFICADO_EMITIDO, matricula.certificadoEmitido)
            .returning()
            .fetchOne { it.toModel() }

    fun update(matriculaId: Long, matricula: Matricula): Matricula? =
        dsl.update(MATRICULA)
            .set(MATRICULA.ALUNO_ID, matricula.alunoId)
            .set(MATRICULA.OFICINA_ID, matricula.oficinaId)
            .set(MATRICULA.DATA_MATRICULA, matricula.dataMatricula)
            .set(MATRICULA.CERTIFICADO_EMITIDO, matricula.certificadoEmitido)
            .set(MATRICULA.UPDATED_AT, LocalDateTime.now())
            .where(MATRICULA.ID.eq(matricula.alunoId))
            .returning()
            .fetchOne { it.toModel() }

}