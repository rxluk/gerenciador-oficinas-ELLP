package br.edu.utfpr.ellp_oficina_manager.service

import br.edu.utfpr.ellp_oficina_manager.config.JwtService
import br.edu.utfpr.ellp_oficina_manager.exception.AlreadyExists
import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import br.edu.utfpr.ellp_oficina_manager.model.usuario.LoginRequest
import br.edu.utfpr.ellp_oficina_manager.model.usuario.LoginResponse
import br.edu.utfpr.ellp_oficina_manager.model.usuario.RegisterRequest
import br.edu.utfpr.ellp_oficina_manager.model.usuario.Usuario
import br.edu.utfpr.ellp_oficina_manager.model.usuario.UsuarioFilter
import br.edu.utfpr.ellp_oficina_manager.repository.RoleRepository
import br.edu.utfpr.ellp_oficina_manager.repository.UsuarioRepository
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val usuarioRepository: UsuarioRepository,
    private val roleRepository: RoleRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
) {

    fun login(request: LoginRequest): LoginResponse {
        val usuario = usuarioRepository.findByFields(UsuarioFilter(email = request.email)).firstOrNull()
            ?: throw NotFoundException("Usuario Not Found")

        if (!passwordEncoder.matches(request.senha, usuario.senha))
            throw NotFoundException("Usuario Not Found")

        val roles = usuarioRepository.findRoles(usuario.id!!)
        val permissions = roles
            .flatMap { role -> roleRepository.findPermissions(role.id!!) }
            .toSet()

        return LoginResponse(
            jwtService.generateToken(
                usuario.id.toString(),
                usuario.email!!,
                permissions.toList()
            )
        )
    }

    @PreAuthorize("hasAuthority('CREATE_USUARIO')")
    fun register(request: RegisterRequest) {

        val alreadyHasEmail = usuarioRepository.findByFields(UsuarioFilter(email = request.email)).isNotEmpty()
        if (alreadyHasEmail) throw AlreadyExists("This user already exists")

        val usuario = Usuario(
            email = request.email,
            senha = passwordEncoder.encode(request.senha),
            nome = request.nome,
            ativo = true
        )

        usuarioRepository.insert(usuario)
    }

}