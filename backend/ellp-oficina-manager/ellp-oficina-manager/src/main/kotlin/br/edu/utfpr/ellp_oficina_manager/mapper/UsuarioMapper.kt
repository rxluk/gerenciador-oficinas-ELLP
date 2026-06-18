package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.UsuarioRecord
import br.edu.utfpr.ellp_oficina_manager.model.usuario.Usuario
import br.edu.utfpr.ellp_oficina_manager.model.usuario.UsuarioRequest
import br.edu.utfpr.ellp_oficina_manager.model.usuario.UsuarioResponse

fun UsuarioRecord.toModel(): Usuario =
    Usuario(
        id = this.id,
        nome = this.nome,
        email = this.email,
        senha = this.senhaHash,
        provider = this.provider,
        providerId = this.providerId,
        ativo = this.ativo,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )

fun UsuarioRequest.toModel(senhaEncoded: String? = null) = Usuario(
    nome = nome,
    email = email,
    senha = senhaEncoded ?: senha,
    provider = provider,
    providerId = providerId,
    ativo = ativo,
)

fun Usuario.toResponse() = UsuarioResponse(
    id = id!!,
    nome = nome,
    email = email,
    ativo = ativo,
)