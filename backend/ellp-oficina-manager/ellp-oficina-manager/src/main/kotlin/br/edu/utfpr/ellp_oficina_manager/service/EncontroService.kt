package br.edu.utfpr.ellp_oficina_manager.service

import br.edu.utfpr.ellp_oficina_manager.exception.AlreadyExists
import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.mapper.toResponse
import br.edu.utfpr.ellp_oficina_manager.model.encontro.EncontroFilter
import br.edu.utfpr.ellp_oficina_manager.model.encontro.EncontroRequest
import br.edu.utfpr.ellp_oficina_manager.model.encontro.EncontroResponse
import br.edu.utfpr.ellp_oficina_manager.model.oficina.OficinaFilter
import br.edu.utfpr.ellp_oficina_manager.repository.EncontroRepository
import br.edu.utfpr.ellp_oficina_manager.repository.OficinaRepository
import org.springframework.stereotype.Service

@Service
class EncontroService(
    private val encontroRepository: EncontroRepository,
    private val oficinaRepository: OficinaRepository,
) {

    fun findAll(): List<EncontroResponse> =
        encontroRepository.findAll().map { it.toResponse() }

    fun findById(id: Long): EncontroResponse =
        encontroRepository.findByFields(EncontroFilter(id = id)).firstOrNull()?.toResponse()
            ?: throw NotFoundException("Encontro não encontrado")

    fun findByOficina(oficinaId: Long): List<EncontroResponse> =
        encontroRepository.findByFields(EncontroFilter(oficinaId = oficinaId)).map { it.toResponse() }

    fun insert(request: EncontroRequest): EncontroResponse {
        oficinaRepository.findByFields(OficinaFilter(id = request.oficinaId)).firstOrNull()
            ?: throw NotFoundException("Oficina não encontrada")

        val encontrosNoMesmoDia = encontroRepository.findByFields(
            EncontroFilter(oficinaId = request.oficinaId, data = request.data)
        )

        val colide = encontrosNoMesmoDia.any { existente ->
            request.horarioInicio < existente.horarioFim && request.horarioFim > existente.horarioInicio
        }

        if (colide) {
            throw AlreadyExists("Já existe um encontro nesse horário para esta oficina")
        }

        return encontroRepository.insert(request.toModel())?.toResponse()
            ?: throw RuntimeException("Erro ao inserir encontro")
    }

    fun update(id: Long, request: EncontroRequest): EncontroResponse {
        findById(id)
        oficinaRepository.findByFields(OficinaFilter(id = request.oficinaId)).firstOrNull()
            ?: throw NotFoundException("Oficina não encontrada")

        return encontroRepository.update(id, request.toModel())?.toResponse()
            ?: throw NotFoundException("Encontro não encontrado")
    }
}