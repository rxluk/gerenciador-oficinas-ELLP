package br.edu.utfpr.ellp_oficina_manager.repository

import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.PERMISSION
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.model.permission.Permission
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class PermissionRepository(
    private val dsl: DSLContext
) {

    fun findAll(): List<Permission> =
        dsl.selectFrom(PERMISSION)
            .fetch()
            .map { it.toModel() }

    fun findById(id: Long): Permission? =
        dsl.selectFrom(PERMISSION)
            .where(PERMISSION.ID.eq(id))
            .fetchOne { it.toModel() }

    fun insert(permission: Permission): Permission? =
        dsl.insertInto(PERMISSION)
            .set(PERMISSION.NOME, permission.nome)
            .returning()
            .fetchOne { it.toModel() }

    fun update(id: Long, permission: Permission): Permission? =
        dsl.update(PERMISSION)
            .set(PERMISSION.NOME, permission.nome)
            .set(PERMISSION.UPDATED_AT, LocalDateTime.now())
            .where(PERMISSION.ID.eq(id))
            .returning()
            .fetchOne { it.toModel() }
}