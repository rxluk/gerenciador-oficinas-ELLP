package br.edu.utfpr.ellp_oficina_manager.service

import br.edu.utfpr.ellp_oficina_manager.exception.AlreadyExists
import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.mapper.toResponse
import br.edu.utfpr.ellp_oficina_manager.model.aluno.AlunoFilter
import br.edu.utfpr.ellp_oficina_manager.model.matricula.MatriculaFilter
import br.edu.utfpr.ellp_oficina_manager.model.matricula.MatriculaRequest
import br.edu.utfpr.ellp_oficina_manager.model.matricula.MatriculaResponse
import br.edu.utfpr.ellp_oficina_manager.model.oficina.OficinaFilter
import br.edu.utfpr.ellp_oficina_manager.repository.AlunoRepository
import br.edu.utfpr.ellp_oficina_manager.repository.MatriculaRepository
import br.edu.utfpr.ellp_oficina_manager.repository.OficinaRepository
import org.springframework.stereotype.Service

@Service
class MatriculaService(
    private val matriculaRepository: MatriculaRepository,
    private val alunoRepository: AlunoRepository,
    private val oficinaRepository: OficinaRepository,
) {

    fun findAll(): List<MatriculaResponse> =
        matriculaRepository.findAll().map { it.toResponse() }

    fun findById(id: Long): MatriculaResponse =
        matriculaRepository.findByFields(MatriculaFilter(id = id)).firstOrNull()?.toResponse()
            ?: throw NotFoundException("Matrícula não encontrada")

    fun findByAluno(alunoId: Long): List<MatriculaResponse> =
        matriculaRepository.findByFields(MatriculaFilter(alunoId = alunoId)).map { it.toResponse() }

    fun findByOficina(oficinaId: Long): List<MatriculaResponse> =
        matriculaRepository.findByFields(MatriculaFilter(oficinaId = oficinaId)).map { it.toResponse() }

    fun insert(request: MatriculaRequest): MatriculaResponse {
        alunoRepository.findByFields(AlunoFilter(id = request.alunoId)).firstOrNull()
            ?: throw NotFoundException("Aluno não encontrado")

        oficinaRepository.findByFields(OficinaFilter(id = request.oficinaId)).firstOrNull()
            ?: throw NotFoundException("Oficina não encontrada")

        val alreadyExists = matriculaRepository.findByFields(
            MatriculaFilter(alunoId = request.alunoId, oficinaId = request.oficinaId)
        ).isNotEmpty()
        if (alreadyExists) throw AlreadyExists("Aluno já matriculado nesta oficina")

        return matriculaRepository.insert(request.toModel())?.toResponse()
            ?: throw RuntimeException("Erro ao inserir matrícula")
    }

    fun update(id: Long, request: MatriculaRequest): MatriculaResponse {
        findById(id)
        alunoRepository.findByFields(AlunoFilter(id = request.alunoId)).firstOrNull()
            ?: throw NotFoundException("Aluno não encontrado")

        oficinaRepository.findByFields(OficinaFilter(id = request.oficinaId)).firstOrNull()
            ?: throw NotFoundException("Oficina não encontrada")

        return matriculaRepository.update(id, request.toModel())?.toResponse()
            ?: throw NotFoundException("Matrícula não encontrada")
    }
}