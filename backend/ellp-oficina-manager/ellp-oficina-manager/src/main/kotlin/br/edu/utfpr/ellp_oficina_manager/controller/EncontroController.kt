package br.edu.utfpr.ellp_oficina_manager.controller

import br.edu.utfpr.ellp_oficina_manager.model.encontro.EncontroRequest
import br.edu.utfpr.ellp_oficina_manager.model.encontro.EncontroResponse
import br.edu.utfpr.ellp_oficina_manager.service.EncontroService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/encontros")
class EncontroController(
    private val encontroService: EncontroService
) {

    @GetMapping
    @PreAuthorize("hasAuthority('READ_ENCONTRO')")
    fun findAll(): ResponseEntity<List<EncontroResponse>> =
        ResponseEntity.ok(encontroService.findAll())

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_ENCONTRO')")
    fun findById(@PathVariable id: Long): ResponseEntity<EncontroResponse> =
        ResponseEntity.ok(encontroService.findById(id))

    @GetMapping("/oficina/{oficinaId}")
    @PreAuthorize("hasAuthority('READ_ENCONTRO')")
    fun findByOficina(@PathVariable oficinaId: Long): ResponseEntity<List<EncontroResponse>> =
        ResponseEntity.ok(encontroService.findByOficina(oficinaId))

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_ENCONTRO')")
    fun insert(@Valid @RequestBody request: EncontroRequest): ResponseEntity<EncontroResponse> =
        ResponseEntity.ok(encontroService.insert(request))

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_ENCONTRO')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: EncontroRequest): ResponseEntity<EncontroResponse> =
        ResponseEntity.ok(encontroService.update(id, request))
}