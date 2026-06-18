package br.edu.utfpr.ellp_oficina_manager.controller

import br.edu.utfpr.ellp_oficina_manager.model.usuario.UsuarioRequest
import br.edu.utfpr.ellp_oficina_manager.model.usuario.UsuarioResponse
import br.edu.utfpr.ellp_oficina_manager.service.UsuarioService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/usuarios")
class UsuarioController(
    private val usuarioService: UsuarioService
) {

    @GetMapping
    @PreAuthorize("hasAuthority('READ_USUARIO')")
    fun findAll(): ResponseEntity<List<UsuarioResponse>> =
        ResponseEntity.ok(usuarioService.findAll())

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_USUARIO')")
    fun findById(@PathVariable id: Long): ResponseEntity<UsuarioResponse> =
        ResponseEntity.ok(usuarioService.findById(id))

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_USUARIO')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: UsuarioRequest): ResponseEntity<UsuarioResponse> =
        ResponseEntity.ok(usuarioService.update(id, request))

    @PostMapping("/{id}/roles/{roleId}")
    @PreAuthorize("hasAuthority('UPDATE_USUARIO')")
    fun addRole(@PathVariable id: Long, @PathVariable roleId: Long): ResponseEntity<Void> {
        usuarioService.addRole(id, roleId)
        return ResponseEntity.ok().build()
    }

    @DeleteMapping("/{id}/roles/{roleId}")
    @PreAuthorize("hasAuthority('UPDATE_USUARIO')")
    fun removeRole(@PathVariable id: Long, @PathVariable roleId: Long): ResponseEntity<Void> {
        usuarioService.removeRole(id, roleId)
        return ResponseEntity.ok().build()
    }

    @GetMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('READ_USUARIO')")
    fun findRoles(@PathVariable id: Long): ResponseEntity<*> =
        ResponseEntity.ok(usuarioService.findRoles(id))
}