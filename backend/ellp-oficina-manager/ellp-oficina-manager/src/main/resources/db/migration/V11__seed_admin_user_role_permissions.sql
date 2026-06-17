INSERT INTO usuario (nome, email, senha_hash, ativo)
VALUES (
           'Admin',
           'admin@admin',
           '$2a$10$7QJ1h0G9c9V1Qq2Ybqv6E.6m1cXy7zX9h2v1m0qP9dQ0bF6vQ9a8K',
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