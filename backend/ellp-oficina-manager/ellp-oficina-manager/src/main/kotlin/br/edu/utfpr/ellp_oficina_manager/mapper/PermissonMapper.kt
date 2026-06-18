package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.PermissionRecord
import br.edu.utfpr.ellp_oficina_manager.model.permission.Permission

fun PermissionRecord.toModel(): Permission =
    Permission(
        id = this.id,
        nome = this.nome,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )
