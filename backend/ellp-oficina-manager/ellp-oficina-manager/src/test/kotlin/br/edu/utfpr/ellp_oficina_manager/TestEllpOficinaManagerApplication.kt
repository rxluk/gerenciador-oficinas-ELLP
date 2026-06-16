package br.edu.utfpr.ellp_oficina_manager

import org.springframework.boot.fromApplication
import org.springframework.boot.with


fun main(args: Array<String>) {
	fromApplication<EllpOficinaManagerApplication>().with(TestcontainersConfiguration::class).run(*args)
}
