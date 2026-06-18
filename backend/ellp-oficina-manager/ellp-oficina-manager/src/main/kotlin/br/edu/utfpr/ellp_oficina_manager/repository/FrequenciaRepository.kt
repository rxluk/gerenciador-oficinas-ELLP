package br.edu.utfpr.ellp_oficina_manager.repository

import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.FREQUENCIA
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.model.frequencia.Frequencia
import br.edu.utfpr.ellp_oficina_manager.model.frequencia.FrequenciaFilter
import org.jooq.Condition
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class FrequenciaRepository(
    private val dsl: DSLContext
) {

    fun findAll(): List<Frequencia> =
        dsl.selectFrom(FREQUENCIA)
            .fetch()
            .map { it.toModel() }

    fun findByFields(filter: FrequenciaFilter): List<Frequencia> {
        val conditions = mutableListOf<Condition>()

        filter.id?.let { conditions +=  FREQUENCIA.ID.eq(it) }
        filter.matriculaId?.let { conditions +=  FREQUENCIA.MATRICULA_ID.eq(it) }
        filter.encontroId?.let { conditions +=  FREQUENCIA.ENCONTRO_ID.eq(it) }
        filter.presente?.let { conditions +=  FREQUENCIA.PRESENTE.eq(it) }

        return dsl.selectFrom(FREQUENCIA)
            .where(conditions)
            .fetch()
            .map { it.toModel() }
    }

    fun insert(frequencia: Frequencia): Frequencia? =
        dsl.insertInto(FREQUENCIA)
            .set(FREQUENCIA.MATRICULA_ID, frequencia.matriculaId)
            .set(FREQUENCIA.ENCONTRO_ID, frequencia.encontroId)
            .set(FREQUENCIA.PRESENTE, frequencia.presente)
            .returning()
            .fetchOne { it.toModel() }

    fun update(frequenciaId: Long, frequencia: Frequencia): Frequencia?=
        dsl.update(FREQUENCIA)
            .set(FREQUENCIA.MATRICULA_ID, frequencia.matriculaId)
            .set(FREQUENCIA.ENCONTRO_ID, frequencia.encontroId)
            .set(FREQUENCIA.PRESENTE, frequencia.presente)
            .set(FREQUENCIA.UPDATED_AT, LocalDateTime.now())
            .where(FREQUENCIA.ID.eq(frequenciaId))
            .returning()
            .fetchOne { it.toModel() }

}