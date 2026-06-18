package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.PermissionRecord
import br.edu.utfpr.ellp_oficina_manager.model.permission.Permission
import br.edu.utfpr.ellp_oficina_manager.model.permission.PermissionRequest
import br.edu.utfpr.ellp_oficina_manager.model.permission.PermissionResponse

fun PermissionRecord.toModel(): Permission =
    Permission(
        id = this.id,
        nome = this.nome,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )

fun PermissionRequest.toModel() = Permission(
    nome = nome,
)

fun Permission.toResponse() = PermissionResponse(
    id = id!!,
    nome = nome,
)