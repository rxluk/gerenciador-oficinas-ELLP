package br.edu.utfpr.ellp_oficina_manager.repository

import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.ALUNO
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.model.aluno.Aluno
import br.edu.utfpr.ellp_oficina_manager.model.aluno.AlunoFilter
import org.jooq.Condition
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class AlunoRepository(
    private val dsl: DSLContext
) {

    fun findAll(): List<Aluno> =
        dsl.selectFrom(ALUNO)
            .fetch()
            .map { it.toModel() }

    fun findByFields(filter: AlunoFilter) : List<Aluno> {
        val conditions =  mutableListOf<Condition>()

        filter.id?.let { conditions += ALUNO.ID.eq(it) }
        filter.nome?.let { conditions += ALUNO.NOME.containsIgnoreCase(it) }
        filter.idade?.let { conditions += ALUNO.IDADE.eq(it) }
        filter.serie?.let { conditions += ALUNO.SERIE.containsIgnoreCase(it)}
        filter.telefone?.let { conditions += ALUNO.TELEFONE.containsIgnoreCase(it) }
        filter.email?.let { conditions += ALUNO.EMAIL.containsIgnoreCase(it) }
        filter.endereco?.let { conditions += ALUNO.ENDERECO.containsIgnoreCase(it) }

        return dsl.selectFrom(ALUNO)
            .where(conditions)
            .fetch()
            .map { it.toModel() }
    }

    fun insert(aluno: Aluno): Aluno? =
        dsl.insertInto(ALUNO)
            .set(ALUNO.NOME, aluno.nome)
            .set(ALUNO.IDADE, aluno.idade)
            .set(ALUNO.SERIE, aluno.serie)
            .set(ALUNO.TELEFONE, aluno.telefone)
            .set(ALUNO.EMAIL, aluno.email)
            .set(ALUNO.ENDERECO, aluno.endereco)
            .returning()
            .fetchOne { it.toModel() }

    fun update(alunoId: Long, aluno: Aluno): Aluno? =
        dsl.update(ALUNO)
            .set(ALUNO.NOME, aluno.nome)
            .set(ALUNO.IDADE, aluno.idade)
            .set(ALUNO.SERIE, aluno.serie)
            .set(ALUNO.TELEFONE, aluno.telefone)
            .set(ALUNO.EMAIL, aluno.email)
            .set(ALUNO.ENDERECO, aluno.endereco)
            .set(ALUNO.UPDATED_AT, LocalDateTime.now())
            .where(ALUNO.ID.eq(alunoId))
            .returning()
            .fetchOne { it.toModel() }



}