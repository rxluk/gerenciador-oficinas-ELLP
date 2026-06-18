package br.edu.utfpr.ellp_oficina_manager.repository

import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.ENCONTRO
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.model.encontro.Encontro
import br.edu.utfpr.ellp_oficina_manager.model.encontro.EncontroFilter
import org.jooq.Condition
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class EncontroRepository(
    private val dsl: DSLContext
) {

    fun findAll(): List<Encontro> =
        dsl.selectFrom(ENCONTRO)
            .fetch()
            .map { it.toModel() }

    fun findByFields(filter: EncontroFilter): List<Encontro> {
        val conditions = mutableListOf<Condition>()

        filter.id?.let { conditions += ENCONTRO.ID.eq(it) }
        filter.oficinaId?.let { conditions += ENCONTRO.OFICINA_ID.eq(it) }
        filter.data?.let { conditions += ENCONTRO.DATA.eq(it) }

        return dsl.selectFrom(ENCONTRO)
            .where(conditions)
            .fetch()
            .map { it.toModel() }
    }

    fun insert(encontro: Encontro): Encontro? =
        dsl.insertInto(ENCONTRO)
            .set(ENCONTRO.OFICINA_ID, encontro.oficinaId)
            .set(ENCONTRO.DATA, encontro.data)
            .set(ENCONTRO.HORARIO_INICIO, encontro.horarioInicio)
            .set(ENCONTRO.HORARIO_FIM, encontro.horarioFim)
            .returning()
            .fetchOne { it.toModel() }

    fun update(encontroId: Long, encontro: Encontro): Encontro? =
        dsl.update(ENCONTRO)
            .set(ENCONTRO.OFICINA_ID, encontro.oficinaId)
            .set(ENCONTRO.DATA, encontro.data)
            .set(ENCONTRO.HORARIO_INICIO, encontro.horarioInicio)
            .set(ENCONTRO.HORARIO_FIM, encontro.horarioFim)
            .set(ENCONTRO.UPDATED_AT, LocalDateTime.now())
            .where(ENCONTRO.ID.eq(encontro.id))
            .returning()
            .fetchOne { it.toModel() }
}