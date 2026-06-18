package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.RoleRecord
import br.edu.utfpr.ellp_oficina_manager.model.role.Role
import br.edu.utfpr.ellp_oficina_manager.model.role.RoleRequest
import br.edu.utfpr.ellp_oficina_manager.model.role.RoleResponse

fun RoleRecord.toModel(): Role =
    Role(
        id = this.id,
        nome = this.nome,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )

fun RoleRequest.toModel() = Role(
    nome = nome,
)

fun Role.toResponse() = RoleResponse(
    id = id!!,
    nome = nome,
)