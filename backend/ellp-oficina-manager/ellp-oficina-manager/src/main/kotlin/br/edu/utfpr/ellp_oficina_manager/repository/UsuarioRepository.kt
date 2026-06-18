package br.edu.utfpr.ellp_oficina_manager.repository

import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.OFICINA
import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.OFICINA_USUARIO
import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.ROLE
import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.USUARIO
import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.USUARIO_ROLE
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.model.oficina.Oficina
import br.edu.utfpr.ellp_oficina_manager.model.usuario.Usuario
import br.edu.utfpr.ellp_oficina_manager.model.usuario.UsuarioFilter
import br.edu.utfpr.ellp_oficina_manager.model.role.Role
import org.jooq.Condition
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class UsuarioRepository(
    private val dsl: DSLContext
) {

    fun findAll() : List<Usuario> =
        dsl.selectFrom(USUARIO)
            .fetch()
            .map { it.toModel() }

    fun findByFields(filter: UsuarioFilter): List<Usuario> {
        val conditions = mutableListOf<Condition>()

        filter.id?.let { conditions += USUARIO.ID.eq(it) }
        filter.nome?.let { conditions += USUARIO.NOME.containsIgnoreCase(it) }
        filter.email?.let { conditions += USUARIO.EMAIL.containsIgnoreCase(it) }
        filter.provider?.let { conditions += USUARIO.PROVIDER.containsIgnoreCase(it) }
        filter.ativo?.let { conditions += USUARIO.ATIVO.eq(it) }

        return dsl.selectFrom(USUARIO)
            .where(conditions)
            .fetch()
            .map { it.toModel() }
    }

    fun insert(usuario: Usuario): Usuario? =
        dsl.insertInto(USUARIO)
            .set(USUARIO.NOME, usuario.nome)
            .set(USUARIO.EMAIL, usuario.email)
            .set(USUARIO.PROVIDER, usuario.provider)
            .set(USUARIO.ATIVO, usuario.ativo)
            .set(USUARIO.SENHA_HASH, usuario.senha)
            .set(USUARIO.PROVIDER_ID, usuario.providerId)
            .returning()
            .fetchOne { it.toModel() }

    fun update(id: Long, usuario: Usuario): Usuario? =
        dsl.update(USUARIO)
            .set(USUARIO.NOME, usuario.nome)
            .set(USUARIO.EMAIL, usuario.email)
            .set(USUARIO.PROVIDER, usuario.provider)
            .set(USUARIO.ATIVO, usuario.ativo)
            .set(USUARIO.SENHA_HASH, usuario.senha)
            .set(USUARIO.PROVIDER_ID, usuario.providerId)
            .set(USUARIO.UPDATED_AT, LocalDateTime.now())
            .where(USUARIO.ID.eq(id))
            .returning()
            .fetchOne { it.toModel() }

    fun addRole(usuarioId: Long, roleId: Long): Boolean =
        dsl.insertInto(USUARIO_ROLE)
            .set(USUARIO_ROLE.USUARIO_ID, usuarioId)
            .set(USUARIO_ROLE.ROLE_ID, roleId)
            .execute() > 0

    fun removeRole(usuarioId: Long, roleId: Long): Boolean =
        dsl.deleteFrom(USUARIO_ROLE)
            .where(
                USUARIO_ROLE.USUARIO_ID.eq(usuarioId)
                    .and(USUARIO_ROLE.ROLE_ID.eq(roleId))
            )
            .execute() > 0

    fun hasRole(usuarioId: Long, roleId: Long): Boolean =
        dsl.fetchExists(
            dsl.selectOne()
                .from(USUARIO_ROLE)
                .where(
                    USUARIO_ROLE.USUARIO_ID.eq(usuarioId)
                        .and(USUARIO_ROLE.ROLE_ID.eq(roleId))
                )
        )

    fun findRoles(usuarioId: Long): List<Role> =
        dsl.select(ROLE.fields().toList())
            .from(ROLE)
            .join(USUARIO_ROLE)
            .on(ROLE.ID.eq(USUARIO_ROLE.ROLE_ID))
            .where(USUARIO_ROLE.USUARIO_ID.eq(usuarioId))
            .fetchInto(ROLE)
            .map { it.toModel() }

    fun findOficinas(usuarioId: Long): List<Oficina> =
        dsl.select(OFICINA.fields().toList())
            .from(OFICINA)
            .join(OFICINA_USUARIO)
            .on(OFICINA.ID.eq(OFICINA_USUARIO.OFICINA_ID))
            .where(OFICINA_USUARIO.USUARIO_ID.eq(usuarioId))
            .fetchInto(OFICINA)
            .map { it.toModel() }

}