package br.edu.utfpr.ellp_oficina_manager.service

import br.edu.utfpr.ellp_oficina_manager.exception.AlreadyExists
import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.mapper.toResponse
import br.edu.utfpr.ellp_oficina_manager.model.aluno.AlunoFilter
import br.edu.utfpr.ellp_oficina_manager.model.aluno.AlunoRequest
import br.edu.utfpr.ellp_oficina_manager.model.aluno.AlunoResponse
import br.edu.utfpr.ellp_oficina_manager.repository.AlunoRepository
import org.springframework.stereotype.Service

@Service
class AlunoService(
    private val alunoRepository: AlunoRepository
) {

    fun findAll(): List<AlunoResponse> =
        alunoRepository.findAll().map { it.toResponse() }

    fun findById(id: Long): AlunoResponse =
        alunoRepository.findByFields(AlunoFilter(id = id)).firstOrNull()?.toResponse()
            ?: throw NotFoundException("Aluno não encontrado")

    fun insert(request: AlunoRequest): AlunoResponse {
        if (request.email != null) {
            val alreadyExists = alunoRepository.findByFields(AlunoFilter(email = request.email)).isNotEmpty()
            if (alreadyExists) throw AlreadyExists("Já existe um aluno com este email")
        }
        return alunoRepository.insert(request.toModel())?.toResponse()
            ?: throw RuntimeException("Erro ao inserir aluno")
    }

    fun update(id: Long, request: AlunoRequest): AlunoResponse {
        findById(id)
        return alunoRepository.update(id, request.toModel())?.toResponse()
            ?: throw NotFoundException("Aluno não encontrado")
    }
}