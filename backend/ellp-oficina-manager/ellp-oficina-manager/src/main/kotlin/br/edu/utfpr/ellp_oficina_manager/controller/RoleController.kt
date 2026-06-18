package br.edu.utfpr.ellp_oficina_manager.controller

import br.edu.utfpr.ellp_oficina_manager.model.role.RoleRequest
import br.edu.utfpr.ellp_oficina_manager.model.role.RoleResponse
import br.edu.utfpr.ellp_oficina_manager.service.RoleService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/roles")
class RoleController(
    private val roleService: RoleService
) {

    @GetMapping
    @PreAuthorize("hasAuthority('READ_ROLE')")
    fun findAll(): ResponseEntity<List<RoleResponse>> =
        ResponseEntity.ok(roleService.findAll())

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_ROLE')")
    fun findById(@PathVariable id: Long): ResponseEntity<RoleResponse> =
        ResponseEntity.ok(roleService.findById(id))

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_ROLE')")
    fun insert(@Valid @RequestBody request: RoleRequest): ResponseEntity<RoleResponse> =
        ResponseEntity.ok(roleService.insert(request))

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_ROLE')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: RoleRequest): ResponseEntity<RoleResponse> =
        ResponseEntity.ok(roleService.update(id, request))

    @PostMapping("/{id}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('UPDATE_ROLE')")
    fun addPermission(@PathVariable id: Long, @PathVariable permissionId: Long): ResponseEntity<Void> {
        roleService.addPermission(id, permissionId)
        return ResponseEntity.ok().build()
    }

    @DeleteMapping("/{id}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('UPDATE_ROLE')")
    fun removePermission(@PathVariable id: Long, @PathVariable permissionId: Long): ResponseEntity<Void> {
        roleService.removePermission(id, permissionId)
        return ResponseEntity.ok().build()
    }

    @GetMapping("/{id}/permissions")
    @PreAuthorize("hasAuthority('READ_ROLE')")
    fun findPermissions(@PathVariable id: Long): ResponseEntity<*> =
        ResponseEntity.ok(roleService.findPermissions(id))
}