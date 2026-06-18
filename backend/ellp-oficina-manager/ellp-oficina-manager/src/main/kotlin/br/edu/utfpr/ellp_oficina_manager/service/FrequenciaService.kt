package br.edu.utfpr.ellp_oficina_manager.service

import br.edu.utfpr.ellp_oficina_manager.exception.AlreadyExists
import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.mapper.toResponse
import br.edu.utfpr.ellp_oficina_manager.model.encontro.EncontroFilter
import br.edu.utfpr.ellp_oficina_manager.model.frequencia.FrequenciaFilter
import br.edu.utfpr.ellp_oficina_manager.model.frequencia.FrequenciaRequest
import br.edu.utfpr.ellp_oficina_manager.model.frequencia.FrequenciaResponse
import br.edu.utfpr.ellp_oficina_manager.model.matricula.MatriculaFilter
import br.edu.utfpr.ellp_oficina_manager.repository.EncontroRepository
import br.edu.utfpr.ellp_oficina_manager.repository.FrequenciaRepository
import br.edu.utfpr.ellp_oficina_manager.repository.MatriculaRepository
import org.springframework.stereotype.Service

@Service
class FrequenciaService(
    private val frequenciaRepository: FrequenciaRepository,
    private val matriculaRepository: MatriculaRepository,
    private val encontroRepository: EncontroRepository,
) {

    fun findAll(): List<FrequenciaResponse> =
        frequenciaRepository.findAll().map { it.toResponse() }

    fun findById(id: Long): FrequenciaResponse =
        frequenciaRepository.findByFields(FrequenciaFilter(id = id)).firstOrNull()?.toResponse()
            ?: throw NotFoundException("Frequência não encontrada")

    fun findByMatricula(matriculaId: Long): List<FrequenciaResponse> =
        frequenciaRepository.findByFields(FrequenciaFilter(matriculaId = matriculaId)).map { it.toResponse() }

    fun findByEncontro(encontroId: Long): List<FrequenciaResponse> =
        frequenciaRepository.findByFields(FrequenciaFilter(encontroId = encontroId)).map { it.toResponse() }

    fun insert(request: FrequenciaRequest): FrequenciaResponse {
        matriculaRepository.findByFields(MatriculaFilter(id = request.matriculaId)).firstOrNull()
            ?: throw NotFoundException("Matrícula não encontrada")

        encontroRepository.findByFields(EncontroFilter(id = request.encontroId)).firstOrNull()
            ?: throw NotFoundException("Encontro não encontrado")

        val alreadyExists = frequenciaRepository.findByFields(
            FrequenciaFilter(matriculaId = request.matriculaId, encontroId = request.encontroId)
        ).isNotEmpty()
        if (alreadyExists) throw AlreadyExists("Frequência já registrada para esta matrícula neste encontro")

        return frequenciaRepository.insert(request.toModel())?.toResponse()
            ?: throw RuntimeException("Erro ao inserir frequência")
    }

    fun update(id: Long, request: FrequenciaRequest): FrequenciaResponse {
        findById(id)
        matriculaRepository.findByFields(MatriculaFilter(id = request.matriculaId)).firstOrNull()
            ?: throw NotFoundException("Matrícula não encontrada")

        encontroRepository.findByFields(EncontroFilter(id = request.encontroId)).firstOrNull()
            ?: throw NotFoundException("Encontro não encontrado")

        return frequenciaRepository.update(id, request.toModel())?.toResponse()
            ?: throw NotFoundException("Frequência não encontrada")
    }
}