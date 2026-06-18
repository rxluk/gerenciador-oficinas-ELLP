package br.edu.utfpr.ellp_oficina_manager.repository

import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.CERTIFICADO
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.model.certificado.Certificado
import br.edu.utfpr.ellp_oficina_manager.model.certificado.CertificadoFilter
import org.jooq.Condition
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class CertificadoRepository(
    private val dsl: DSLContext,
) {
    fun findall(): List<Certificado> =
            dsl.selectFrom(CERTIFICADO)
                .fetch()
                .map { it.toModel() }

    fun findByFields(filter: CertificadoFilter): List<Certificado> {
        val conditions = mutableListOf<Condition>()

        filter.id?.let { conditions += CERTIFICADO.ID.eq(it) }
        filter.nome?.let { conditions += CERTIFICADO.NOME.containsIgnoreCase(it) }

        return dsl.selectFrom(CERTIFICADO)
            .where(conditions)
            .fetch()
            .map { it.toModel() }
    }

    fun insert(certificado: Certificado): Certificado? =
        dsl.insertInto(CERTIFICADO)
            .set(CERTIFICADO.NOME, certificado.nome)
            .set(CERTIFICADO.DESCRICAO, certificado.descricao)
            .set(CERTIFICADO.REQUER_ASSINATURA, certificado.requerAssinatura)
            .set(CERTIFICADO.TEMPLATE, certificado.template)
            .returning()
            .fetchOne { it.toModel() }

    fun update(certificadoId: Long, certificado: Certificado): Certificado? =
        dsl.update(CERTIFICADO)
            .set(CERTIFICADO.NOME, certificado.nome)
            .set(CERTIFICADO.DESCRICAO, certificado.descricao)
            .set(CERTIFICADO.REQUER_ASSINATURA, certificado.requerAssinatura)
            .set(CERTIFICADO.TEMPLATE, certificado.template)
            .set(CERTIFICADO.UPDATED_AT, LocalDateTime.now())
            .where(CERTIFICADO.ID.eq(certificadoId))
            .returning()
            .fetchOne { it.toModel() }


}