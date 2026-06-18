package br.edu.utfpr.ellp_oficina_manager.config

import br.edu.utfpr.ellp_oficina_manager.exception.AlreadyExists
import br.edu.utfpr.ellp_oficina_manager.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

data class ErrorResponse(
    val message: String,
    val status: Int
)

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(AlreadyExists::class)
    fun handleAlreadyExists(ex: AlreadyExists): ResponseEntity<ErrorResponse> =
        ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ErrorResponse(ex.message, 409))

    @ExceptionHandler(NotFoundException::class)
    fun handleNotFound(ex: NotFoundException): ResponseEntity<ErrorResponse> =
        ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse(ex.message, 404))

    @ExceptionHandler(Exception::class)
    fun handleGeneric(ex: Exception): ResponseEntity<ErrorResponse> =
        ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse(ex.message ?: "Internal server error", 500))
}