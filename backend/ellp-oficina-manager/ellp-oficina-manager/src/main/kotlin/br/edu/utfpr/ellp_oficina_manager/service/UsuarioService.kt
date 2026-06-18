package br.edu.utfpr.ellp_oficina_manager.service

import br.edu.utfpr.ellp_oficina_manager.exception.AlreadyExists
import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.mapper.toResponse
import br.edu.utfpr.ellp_oficina_manager.model.role.Role
import br.edu.utfpr.ellp_oficina_manager.model.usuario.UsuarioFilter
import br.edu.utfpr.ellp_oficina_manager.model.usuario.UsuarioRequest
import br.edu.utfpr.ellp_oficina_manager.model.usuario.UsuarioResponse
import br.edu.utfpr.ellp_oficina_manager.repository.RoleRepository
import br.edu.utfpr.ellp_oficina_manager.repository.UsuarioRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UsuarioService(
    private val usuarioRepository: UsuarioRepository,
    private val roleRepository: RoleRepository,
    private val passwordEncoder: PasswordEncoder,
) {

    fun findAll(): List<UsuarioResponse> =
        usuarioRepository.findAll().map { it.toResponse() }

    fun findById(id: Long): UsuarioResponse =
        usuarioRepository.findByFields(UsuarioFilter(id = id)).firstOrNull()?.toResponse()
            ?: throw NotFoundException("Usuário não encontrado")

    fun update(id: Long, request: UsuarioRequest): UsuarioResponse {
        findById(id)

        if (request.email != null) {
            val alreadyExists = usuarioRepository.findByFields(UsuarioFilter(email = request.email))
                .any { it.id != id }
            if (alreadyExists) throw AlreadyExists("Já existe um usuário com este email")
        }

        val senhaEncoded = request.senha?.let { passwordEncoder.encode(it) }

        return usuarioRepository.update(id, request.toModel(senhaEncoded))?.toResponse()
            ?: throw NotFoundException("Usuário não encontrado")
    }

    fun addRole(usuarioId: Long, roleId: Long) {
        findById(usuarioId)
        roleRepository.findById(roleId) ?: throw NotFoundException("Role não encontrada")

        if (usuarioRepository.hasRole(usuarioId, roleId))
            throw AlreadyExists("Usuário já possui esta role")

        usuarioRepository.addRole(usuarioId, roleId)
    }

    fun removeRole(usuarioId: Long, roleId: Long) {
        findById(usuarioId)
        roleRepository.findById(roleId) ?: throw NotFoundException("Role não encontrada")
        usuarioRepository.removeRole(usuarioId, roleId)
    }

    fun findRoles(usuarioId: Long): List<Role> {
        findById(usuarioId)
        return usuarioRepository.findRoles(usuarioId)
    }
}