package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.RoleRecord
import br.edu.utfpr.ellp_oficina_manager.model.role.Role

fun RoleRecord.toModel(): Role =
    Role(
        id = this.id,
        nome = this.nome,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )