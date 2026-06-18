package br.edu.utfpr.ellp_oficina_manager.service

import br.edu.utfpr.ellp_oficina_manager.exception.AlreadyExists
import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import br.edu.utfpr.ellp_oficina_manager.mapper.toResponse
import br.edu.utfpr.ellp_oficina_manager.model.oficina.OficinaFilter
import br.edu.utfpr.ellp_oficina_manager.model.oficina.OficinaRequest
import br.edu.utfpr.ellp_oficina_manager.model.oficina.OficinaResponse
import br.edu.utfpr.ellp_oficina_manager.repository.CertificadoRepository
import br.edu.utfpr.ellp_oficina_manager.repository.OficinaRepository
import br.edu.utfpr.ellp_oficina_manager.repository.UsuarioRepository
import br.edu.utfpr.ellp_oficina_manager.model.certificado.CertificadoFilter
import br.edu.utfpr.ellp_oficina_manager.model.usuario.UsuarioFilter
import org.springframework.stereotype.Service

@Service
class OficinaService(
    private val oficinaRepository: OficinaRepository,
    private val certificadoRepository: CertificadoRepository,
    private val usuarioRepository: UsuarioRepository,
) {

    fun findAll(): List<OficinaResponse> =
        oficinaRepository.findall().map { it.toResponse() }

    fun findById(id: Long): OficinaResponse =
        oficinaRepository.findByFields(OficinaFilter(id = id)).firstOrNull()?.toResponse()
            ?: throw NotFoundException("Oficina não encontrada")

    fun insert(request: OficinaRequest): OficinaResponse {
        usuarioRepository.findByFields(UsuarioFilter(id = request.professorId)).firstOrNull()
            ?: throw NotFoundException("Professor não encontrado")

        certificadoRepository.findByFields(CertificadoFilter(id = request.certificadoId)).firstOrNull()
            ?: throw NotFoundException("Certificado não encontrado")

        val alreadyExists = oficinaRepository.findByFields(OficinaFilter(titulo = request.titulo)).isNotEmpty()
        if (alreadyExists) throw AlreadyExists("Já existe uma oficina com este título")

        return oficinaRepository.insert(request.toModel())?.toResponse()
            ?: throw RuntimeException("Erro ao inserir oficina")
    }

    fun update(id: Long, request: OficinaRequest): OficinaResponse {
        findById(id)
        usuarioRepository.findByFields(UsuarioFilter(id = request.professorId)).firstOrNull()
            ?: throw NotFoundException("Professor não encontrado")

        certificadoRepository.findByFields(CertificadoFilter(id = request.certificadoId)).firstOrNull()
            ?: throw NotFoundException("Certificado não encontrado")

        return oficinaRepository.update(id, request.toModel())?.toResponse()
            ?: throw NotFoundException("Oficina não encontrada")
    }
}