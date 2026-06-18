package br.edu.utfpr.ellp_oficina_manager.service

import br.edu.utfpr.ellp_oficina_manager.exception.AlreadyExists
import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.mapper.toResponse
import br.edu.utfpr.ellp_oficina_manager.model.permission.Permission
import br.edu.utfpr.ellp_oficina_manager.model.role.RoleRequest
import br.edu.utfpr.ellp_oficina_manager.model.role.RoleResponse
import br.edu.utfpr.ellp_oficina_manager.repository.PermissionRepository
import br.edu.utfpr.ellp_oficina_manager.repository.RoleRepository
import org.springframework.stereotype.Service

@Service
class RoleService(
    private val roleRepository: RoleRepository,
    private val permissionRepository: PermissionRepository,
) {

    fun findAll(): List<RoleResponse> =
        roleRepository.findAll().map { it.toResponse() }

    fun findById(id: Long): RoleResponse =
        roleRepository.findById(id)?.toResponse()
            ?: throw NotFoundException("Role não encontrada")

    fun insert(request: RoleRequest): RoleResponse {
        roleRepository.findByName(request.nome)?.let {
            throw AlreadyExists("Já existe uma role com este nome")
        }
        return roleRepository.insert(request.toModel())?.toResponse()
            ?: throw RuntimeException("Erro ao inserir role")
    }

    fun update(id: Long, request: RoleRequest): RoleResponse {
        findById(id)
        roleRepository.findByName(request.nome)?.let {
            if (it.id != id) throw AlreadyExists("Já existe uma role com este nome")
        }
        return roleRepository.update(id, request.toModel())?.toResponse()
            ?: throw NotFoundException("Role não encontrada")
    }

    fun addPermission(roleId: Long, permissionId: Long) {
        findById(roleId)
        permissionRepository.findById(permissionId) ?: throw NotFoundException("Permission não encontrada")

        if (roleRepository.hasPermission(roleId, permissionId))
            throw AlreadyExists("Role já possui esta permission")

        roleRepository.addPermission(roleId, permissionId)
    }

    fun removePermission(roleId: Long, permissionId: Long) {
        findById(roleId)
        permissionRepository.findById(permissionId) ?: throw NotFoundException("Permission não encontrada")
        roleRepository.removePermission(roleId, permissionId)
    }

    fun findPermissions(roleId: Long): List<Permission> {
        findById(roleId)
        return roleRepository.findPermissions(roleId)
    }
}