package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.CertificadoRecord
import br.edu.utfpr.ellp_oficina_manager.model.certificado.Certificado
import br.edu.utfpr.ellp_oficina_manager.model.certificado.CertificadoRequest
import br.edu.utfpr.ellp_oficina_manager.model.certificado.CertificadoResponse

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

fun CertificadoRequest.toModel() = Certificado(
    id = 0,
    nome = nome,
    descricao = descricao,
    template = template,
    requerAssinatura = requerAssinatura,
    createdAt = java.time.LocalDateTime.now(),
    updatedAt = java.time.LocalDateTime.now(),
)

fun Certificado.toResponse() = CertificadoResponse(
    id = id,
    nome = nome,
    descricao = descricao,
    template = template,
    requerAssinatura = requerAssinatura
)