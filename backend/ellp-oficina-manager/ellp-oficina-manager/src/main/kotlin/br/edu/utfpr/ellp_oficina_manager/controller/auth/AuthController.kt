package br.edu.utfpr.ellp_oficina_manager.controller.auth

import br.edu.utfpr.ellp_oficina_manager.model.usuario.LoginRequest
import br.edu.utfpr.ellp_oficina_manager.model.usuario.LoginResponse
import br.edu.utfpr.ellp_oficina_manager.model.usuario.RegisterRequest
import br.edu.utfpr.ellp_oficina_manager.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class AuthController(
    private val authService: AuthService,

) {

    @PostMapping("/login")
    fun login(
        @Valid @RequestBody request: LoginRequest
    ): ResponseEntity<LoginResponse> =
        ResponseEntity.ok(authService.login(request))

    @PostMapping("/register")
    fun register(
        @Valid @RequestBody request: RegisterRequest
    ) : ResponseEntity<Void> {
        authService.register(request)
        return ResponseEntity.ok().build()
    }
}