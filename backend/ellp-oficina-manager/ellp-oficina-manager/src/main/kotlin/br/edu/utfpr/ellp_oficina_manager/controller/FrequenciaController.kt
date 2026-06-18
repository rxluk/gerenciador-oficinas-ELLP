package br.edu.utfpr.ellp_oficina_manager.controller

import br.edu.utfpr.ellp_oficina_manager.model.frequencia.FrequenciaRequest
import br.edu.utfpr.ellp_oficina_manager.model.frequencia.FrequenciaResponse
import br.edu.utfpr.ellp_oficina_manager.service.FrequenciaService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/frequencias")
class FrequenciaController(
    private val frequenciaService: FrequenciaService
) {

    @GetMapping
    @PreAuthorize("hasAuthority('READ_FREQUENCIA')")
    fun findAll(): ResponseEntity<List<FrequenciaResponse>> =
        ResponseEntity.ok(frequenciaService.findAll())

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_FREQUENCIA')")
    fun findById(@PathVariable id: Long): ResponseEntity<FrequenciaResponse> =
        ResponseEntity.ok(frequenciaService.findById(id))

    @GetMapping("/matricula/{matriculaId}")
    @PreAuthorize("hasAuthority('READ_FREQUENCIA')")
    fun findByMatricula(@PathVariable matriculaId: Long): ResponseEntity<List<FrequenciaResponse>> =
        ResponseEntity.ok(frequenciaService.findByMatricula(matriculaId))

    @GetMapping("/encontro/{encontroId}")
    @PreAuthorize("hasAuthority('READ_FREQUENCIA')")
    fun findByEncontro(@PathVariable encontroId: Long): ResponseEntity<List<FrequenciaResponse>> =
        ResponseEntity.ok(frequenciaService.findByEncontro(encontroId))

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_FREQUENCIA')")
    fun insert(@Valid @RequestBody request: FrequenciaRequest): ResponseEntity<FrequenciaResponse> =
        ResponseEntity.ok(frequenciaService.insert(request))

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_FREQUENCIA')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: FrequenciaRequest): ResponseEntity<FrequenciaResponse> =
        ResponseEntity.ok(frequenciaService.update(id, request))
}