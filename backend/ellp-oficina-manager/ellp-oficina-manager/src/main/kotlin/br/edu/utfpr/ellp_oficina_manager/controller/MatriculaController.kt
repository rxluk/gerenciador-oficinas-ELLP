package br.edu.utfpr.ellp_oficina_manager.controller

import br.edu.utfpr.ellp_oficina_manager.model.matricula.MatriculaRequest
import br.edu.utfpr.ellp_oficina_manager.model.matricula.MatriculaResponse
import br.edu.utfpr.ellp_oficina_manager.service.MatriculaService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/matriculas")
class MatriculaController(
    private val matriculaService: MatriculaService
) {

    @GetMapping
    @PreAuthorize("hasAuthority('READ_MATRICULA')")
    fun findAll(): ResponseEntity<List<MatriculaResponse>> =
        ResponseEntity.ok(matriculaService.findAll())

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_MATRICULA')")
    fun findById(@PathVariable id: Long): ResponseEntity<MatriculaResponse> =
        ResponseEntity.ok(matriculaService.findById(id))

    @GetMapping("/aluno/{alunoId}")
    @PreAuthorize("hasAuthority('READ_MATRICULA')")
    fun findByAluno(@PathVariable alunoId: Long): ResponseEntity<List<MatriculaResponse>> =
        ResponseEntity.ok(matriculaService.findByAluno(alunoId))

    @GetMapping("/oficina/{oficinaId}")
    @PreAuthorize("hasAuthority('READ_MATRICULA')")
    fun findByOficina(@PathVariable oficinaId: Long): ResponseEntity<List<MatriculaResponse>> =
        ResponseEntity.ok(matriculaService.findByOficina(oficinaId))

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_MATRICULA')")
    fun insert(@Valid @RequestBody request: MatriculaRequest): ResponseEntity<MatriculaResponse> =
        ResponseEntity.ok(matriculaService.insert(request))

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_MATRICULA')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: MatriculaRequest): ResponseEntity<MatriculaResponse> =
        ResponseEntity.ok(matriculaService.update(id, request))
}