INSERT INTO usuario (nome, email, senha_hash, ativo)
VALUES (
           'Admin',
           'admin@admin',
           '$2a$10$QvYygivPhcioTf2F4zB2k.ezvsyKaPHgw/L6tvacMmkmSQmNY.T/m',
           TRUE
       );

INSERT INTO usuario_role (usuario_id, role_id)
SELECT
    u.id,
    r.id
FROM usuario u
         JOIN role r ON r.nome = 'ADMIN'
WHERE u.email = 'admin@admin';

INSERT INTO role_permission (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM role r
         CROSS JOIN permission p
WHERE r.nome = 'ADMIN';