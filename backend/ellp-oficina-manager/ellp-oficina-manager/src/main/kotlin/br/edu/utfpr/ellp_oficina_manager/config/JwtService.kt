package br.edu.utfpr.ellp_oficina_manager.config

import br.edu.utfpr.ellp_oficina_manager.model.permission.Permission
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

@Service
class JwtService(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expiration: Long
) {

    private val issuer = "ellp-oficina-manager"

    private val algorithm by lazy {
        Algorithm.HMAC256(secret)
    }


    fun generateToken(userId: String, email: String, permissions: List<Permission>): String =
        JWT.create()
            .withIssuer(issuer)
            .withSubject(email)
            .withClaim("userId", userId)
            .withClaim("permissions", permissions.map { it.nome })
            .withIssuedAt(Date())
            .withExpiresAt(Date(System.currentTimeMillis() + expiration))
            .sign(algorithm)

    fun validateToken(token: String): Boolean =
        try {
            val verifier = JWT.require(algorithm)
                .withIssuer(issuer)
                .build()

            verifier.verify(token)
            true
        }catch (e: Exception) {
            false
        }

    fun getSubject(token: String): String =
        JWT.require(algorithm)
            .withIssuer(issuer)
            .build()
            .verify(token)
            .subject

    fun getUserId(token: String): Long =
        JWT.require(algorithm)
            .withIssuer(issuer)
            .build()
            .verify(token)
            .getClaim("userId").asLong()

    fun getUserPermissions(token: String): List<String> =
        JWT.require(algorithm)
            .withIssuer(issuer)
            .build()
            .verify(token)
            .getClaim("permissions").asList(String::class.java)

}