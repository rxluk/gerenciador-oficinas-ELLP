package br.edu.utfpr.ellp_oficina_manager.repository

import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.PERMISSION
import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.ROLE
import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.ROLE_PERMISSION
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.model.permission.Permission
import br.edu.utfpr.ellp_oficina_manager.model.role.Role
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class RoleRepository(
    private val dsl: DSLContext
) {

    fun findAll(): List<Role> =
        dsl.selectFrom(ROLE)
            .fetch()
            .map { it.toModel() }

    fun findById(id: Long): Role? =
        dsl.selectFrom(ROLE)
            .where(ROLE.ID.eq(id))
            .fetchOne { it.toModel() }

    fun findByName(name: String): Role? =
        dsl.selectFrom(ROLE)
            .where(ROLE.NOME.eq(name))
            .fetchOne { it.toModel() }

    fun insert(role: Role): Role? =
        dsl.insertInto(ROLE)
        .set(ROLE.NOME, role.nome)
        .returning()
        .fetchOne { it.toModel() }

    fun update(id: Long, role: Role): Role? =
        dsl.update(ROLE)
            .set(ROLE.NOME, role.nome)
            .set(ROLE.UPDATED_AT, LocalDateTime.now())
            .where(ROLE.ID.eq(id))
            .returning()
            .fetchOne { it.toModel() }

    fun addPermission(roleId: Long, permissionId: Long): Boolean =
        dsl.insertInto(ROLE_PERMISSION)
            .set(ROLE_PERMISSION.ROLE_ID, roleId)
            .set(ROLE_PERMISSION.PERMISSION_ID, permissionId)
            .execute() > 0

    fun removePermission(roleId: Long, permissionId: Long): Boolean =
        dsl.deleteFrom(ROLE_PERMISSION)
            .where(
                ROLE_PERMISSION.ROLE_ID.eq(roleId)
                    .and(ROLE_PERMISSION.PERMISSION_ID.eq(permissionId))
            )
            .execute() > 0

    fun hasPermission(roleId: Long, permissionId: Long): Boolean =
        dsl.fetchExists(
            dsl.selectOne()
                .from(ROLE_PERMISSION)
                .where(
                    ROLE_PERMISSION.ROLE_ID.eq(roleId)
                        .and(ROLE_PERMISSION.PERMISSION_ID.eq(permissionId))
                )
        )

    fun findPermissions(roleId: Long): List<Permission> =
        dsl.select(PERMISSION.fields().toList())
            .from(PERMISSION)
            .join(ROLE_PERMISSION)
            .on(PERMISSION.ID.eq(ROLE_PERMISSION.PERMISSION_ID))
            .where(ROLE_PERMISSION.ROLE_ID.eq(roleId))
            .fetchInto(PERMISSION)
            .map { it.toModel() }

}