package br.edu.utfpr.ellp_oficina_manager.controller

import br.edu.utfpr.ellp_oficina_manager.model.permission.PermissionRequest
import br.edu.utfpr.ellp_oficina_manager.model.permission.PermissionResponse
import br.edu.utfpr.ellp_oficina_manager.service.PermissionService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/permissions")
class PermissionController(
    private val permissionService: PermissionService
) {

    @GetMapping
    @PreAuthorize("hasAuthority('READ_PERMISSION')")
    fun findAll(): ResponseEntity<List<PermissionResponse>> =
        ResponseEntity.ok(permissionService.findAll())

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_PERMISSION')")
    fun findById(@PathVariable id: Long): ResponseEntity<PermissionResponse> =
        ResponseEntity.ok(permissionService.findById(id))

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_PERMISSION')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: PermissionRequest): ResponseEntity<PermissionResponse> =
        ResponseEntity.ok(permissionService.update(id, request))
}