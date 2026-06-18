package br.edu.utfpr.ellp_oficina_manager.controller

import br.edu.utfpr.ellp_oficina_manager.model.aluno.AlunoRequest
import br.edu.utfpr.ellp_oficina_manager.model.aluno.AlunoResponse
import br.edu.utfpr.ellp_oficina_manager.service.AlunoService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/alunos")
class AlunoController(
    private val alunoService: AlunoService
) {

    @GetMapping
    @PreAuthorize("hasAuthority('READ_ALUNO')")
    fun findAll(): ResponseEntity<List<AlunoResponse>> =
        ResponseEntity.ok(alunoService.findAll())

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_ALUNO')")
    fun findById(@PathVariable id: Long): ResponseEntity<AlunoResponse> =
        ResponseEntity.ok(alunoService.findById(id))

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_ALUNO')")
    fun insert(@Valid @RequestBody request: AlunoRequest): ResponseEntity<AlunoResponse> =
        ResponseEntity.ok(alunoService.insert(request))

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_ALUNO')")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: AlunoRequest): ResponseEntity<AlunoResponse> =
        ResponseEntity.ok(alunoService.update(id, request))
}