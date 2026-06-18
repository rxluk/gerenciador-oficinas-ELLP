package br.edu.utfpr.ellp_oficina_manager.config

import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.ROLE
import br.edu.utfpr.ellp_oficina_manager.jooq.Tables.USUARIO_ROLE
import br.edu.utfpr.ellp_oficina_manager.mapper.toModel
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtFilter(
    private val jwtService: JwtService,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {

        val authHeader = request.getHeader("Authorization")

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val token = authHeader.substring(7)

        if (!jwtService.validateToken(token)) {
            filterChain.doFilter(request, response)
            return
        }

        val email = jwtService.getSubject(token)
        val permissions = jwtService.getUserPermissions(token)

        val authorities = permissions.map { SimpleGrantedAuthority(it) }

        val authentication = UsernamePasswordAuthenticationToken(
            email,
            null,
            authorities
        )

        authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
        SecurityContextHolder.getContext().authentication = authentication
        filterChain.doFilter(request, response)
    }
}