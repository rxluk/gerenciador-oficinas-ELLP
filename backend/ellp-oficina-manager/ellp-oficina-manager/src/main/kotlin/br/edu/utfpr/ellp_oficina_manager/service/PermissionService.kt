package br.edu.utfpr.ellp_oficina_manager.service

import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.mapper.toResponse
import br.edu.utfpr.ellp_oficina_manager.model.permission.PermissionRequest
import br.edu.utfpr.ellp_oficina_manager.model.permission.PermissionResponse
import br.edu.utfpr.ellp_oficina_manager.repository.PermissionRepository
import org.springframework.stereotype.Service

@Service
class PermissionService(
    private val permissionRepository: PermissionRepository,
) {

    fun findAll(): List<PermissionResponse> =
        permissionRepository.findAll().map { it.toResponse() }

    fun findById(id: Long): PermissionResponse =
        permissionRepository.findById(id)?.toResponse()
            ?: throw NotFoundException("Permission não encontrada")

    fun update(id: Long, request: PermissionRequest): PermissionResponse {
        findById(id)
        return permissionRepository.update(id, request.toModel())?.toResponse()
            ?: throw NotFoundException("Permission não encontrada")
    }
}