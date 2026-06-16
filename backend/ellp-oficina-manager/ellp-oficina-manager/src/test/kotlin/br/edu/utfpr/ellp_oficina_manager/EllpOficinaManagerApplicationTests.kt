package br.edu.utfpr.ellp_oficina_manager

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import

@Import(TestcontainersConfiguration::class)
@SpringBootTest
class EllpOficinaManagerApplicationTests {

	@Test
	fun contextLoads() {
	}

}
