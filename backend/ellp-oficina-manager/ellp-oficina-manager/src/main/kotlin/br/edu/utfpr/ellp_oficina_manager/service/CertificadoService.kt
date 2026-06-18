package br.edu.utfpr.ellp_oficina_manager.service

import br.edu.utfpr.ellp_oficina_manager.exception.AlreadyExists
import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.mapper.toResponse
import br.edu.utfpr.ellp_oficina_manager.model.certificado.CertificadoFilter
import br.edu.utfpr.ellp_oficina_manager.model.certificado.CertificadoRequest
import br.edu.utfpr.ellp_oficina_manager.model.certificado.CertificadoResponse
import br.edu.utfpr.ellp_oficina_manager.repository.CertificadoRepository
import org.springframework.stereotype.Service

@Service
class CertificadoService(
    private val certificadoRepository: CertificadoRepository
) {

    fun findAll(): List<CertificadoResponse> =
        certificadoRepository.findall().map { it.toResponse() }

    fun findById(id: Long): CertificadoResponse =
        certificadoRepository.findByFields(CertificadoFilter(id = id)).firstOrNull()?.toResponse()
            ?: throw NotFoundException("Certificado não encontrado")

    fun insert(request: CertificadoRequest): CertificadoResponse {
        val alreadyExists = certificadoRepository.findByFields(CertificadoFilter(nome = request.nome)).isNotEmpty()
        if (alreadyExists) throw AlreadyExists("Já existe um certificado com este nome")
        return certificadoRepository.insert(request.toModel())?.toResponse()
            ?: throw RuntimeException("Erro ao inserir certificado")
    }

    fun update(id: Long, request: CertificadoRequest): CertificadoResponse {
        findById(id)
        return certificadoRepository.update(id, request.toModel())?.toResponse()
            ?: throw NotFoundException("Certificado não encontrado")
    }
}