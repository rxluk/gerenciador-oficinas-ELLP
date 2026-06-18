package br.edu.utfpr.ellp_oficina_manager.controller

import br.edu.utfpr.ellp_oficina_manager.model.certificado.CertificadoRequest
import br.edu.utfpr.ellp_oficina_manager.model.certificado.CertificadoResponse
import br.edu.utfpr.ellp_oficina_manager.service.CertificadoService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/certificados")
class CertificadoController(
    private val certificadoService: CertificadoService
) {

    @GetMapping
    @PreAuthorize("hasAuthority('READ_CERTIFICADO')")
    fun findAll(): ResponseEntity<List<CertificadoResponse>> =
        ResponseEntity.ok(certificadoService.findAll())

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_CERTIFICADO')")
    fun findById(@PathVariable id: Long): ResponseEntity<CertificadoResponse> =
        ResponseEntity.ok(certificadoService.findById(id))

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_CERTIFICADO')")
    fun insert(@Valid @RequestBody request: CertificadoRequest): ResponseEntity<CertificadoResponse> =
        ResponseEntity.ok(certificadoService.insert(request))

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_CERTIFICADO')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: CertificadoRequest): ResponseEntity<CertificadoResponse> =
        ResponseEntity.ok(certificadoService.update(id, request))
}