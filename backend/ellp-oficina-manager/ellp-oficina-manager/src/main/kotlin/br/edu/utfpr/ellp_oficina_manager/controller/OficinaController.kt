package br.edu.utfpr.ellp_oficina_manager.controller

import br.edu.utfpr.ellp_oficina_manager.model.oficina.OficinaRequest
import br.edu.utfpr.ellp_oficina_manager.model.oficina.OficinaResponse
import br.edu.utfpr.ellp_oficina_manager.service.OficinaService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/oficinas")
class OficinaController(
    private val oficinaService: OficinaService
) {

    @GetMapping
    @PreAuthorize("hasAuthority('READ_OFICINA')")
    fun findAll(): ResponseEntity<List<OficinaResponse>> =
        ResponseEntity.ok(oficinaService.findAll())

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_OFICINA')")
    fun findById(@PathVariable id: Long): ResponseEntity<OficinaResponse> =
        ResponseEntity.ok(oficinaService.findById(id))

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_OFICINA')")
    fun insert(@Valid @RequestBody request: OficinaRequest): ResponseEntity<OficinaResponse> =
        ResponseEntity.ok(oficinaService.insert(request))

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_OFICINA')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: OficinaRequest): ResponseEntity<OficinaResponse> =
        ResponseEntity.ok(oficinaService.update(id, request))
}