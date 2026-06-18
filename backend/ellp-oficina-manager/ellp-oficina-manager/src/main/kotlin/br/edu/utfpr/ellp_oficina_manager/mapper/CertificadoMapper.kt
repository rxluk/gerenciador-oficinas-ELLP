package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.CertificadoRecord
import br.edu.utfpr.ellp_oficina_manager.model.certificado.Certificado

fun CertificadoRecord.toModel(): Certificado =
    Certificado(
        id = this.id,
        nome = this.nome,
        descricao = this.descricao,
        requerAssinatura = this.requerAssinatura,
        template = this.template,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )
