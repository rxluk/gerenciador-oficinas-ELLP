package br.edu.utfpr.ellp_oficina_manager.repository

import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.OFICINA
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.model.oficina.Oficina
import br.edu.utfpr.ellp_oficina_manager.model.oficina.OficinaFilter
import org.jooq.Condition
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class OficinaRepository(
    private val dsl: DSLContext,
) {

    fun findall(): List<Oficina> =
        dsl.selectFrom(OFICINA)
            .fetch()
            .map { it.toModel() }

    fun findByFields(filter: OficinaFilter): List<Oficina> {
        val conditions = mutableListOf<Condition>()

        filter.id?.let { conditions += OFICINA.ID.eq(it) }
        filter.professorId?.let { conditions += OFICINA.PROFESSOR_ID.eq(it) }
        filter.certificadoId?.let { conditions += OFICINA.CERTIFICADO_ID.eq(it) }
        filter.titulo?.let { conditions += OFICINA.TITULO.containsIgnoreCase(it) }
        filter.sala?.let { conditions += OFICINA.SALA.containsIgnoreCase(it) }

        return dsl.selectFrom(OFICINA)
            .where(conditions)
            .fetch()
            .map { it.toModel() }
    }

    fun insert(oficina: Oficina): Oficina? =
        dsl.insertInto(OFICINA)
            .set(OFICINA.PROFESSOR_ID, oficina.professorId)
            .set(OFICINA.CERTIFICADO_ID, oficina.certificadoId)
            .set(OFICINA.TITULO, oficina.titulo)
            .set(OFICINA.SALA, oficina.sala)
            .set(OFICINA.DESCRICAO, oficina.descricao)
            .set(OFICINA.DATA_INICIO, oficina.dataInicio)
            .set(OFICINA.DATA_FIM, oficina.dataFim)
            .returning()
            .fetchOne { it.toModel() }

    fun update(oficinaId: Long, oficina: Oficina): Oficina? =
            dsl.update(OFICINA)
                .set(OFICINA.PROFESSOR_ID, oficina.professorId)
                .set(OFICINA.CERTIFICADO_ID, oficina.certificadoId)
                .set(OFICINA.TITULO, oficina.titulo)
                .set(OFICINA.DESCRICAO, oficina.descricao)
                .set(OFICINA.SALA, oficina.sala)
                .set(OFICINA.DATA_INICIO, oficina.dataInicio)
                .set(OFICINA.DATA_FIM, oficina.dataFim)
                .set(OFICINA.UPDATED_AT, LocalDateTime.now())
                .where(OFICINA.ID.eq(oficinaId))
                .returning()
                .fetchOne { it.toModel() }

}