CREATE TABLE oficina_usuario (
    oficina_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    PRIMARY KEY (oficina_id, usuario_id),
    FOREIGN KEY (oficina_id) REFERENCES oficina(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);