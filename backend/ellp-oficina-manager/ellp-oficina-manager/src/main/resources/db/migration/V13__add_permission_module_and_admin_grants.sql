INSERT INTO permission (nome)
VALUES
    ('CREATE_PERMISSION'),
    ('READ_PERMISSION'),
    ('UPDATE_PERMISSION')
    ON CONFLICT (nome) DO NOTHING;

INSERT INTO role_permission (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM role r
         JOIN permission p ON TRUE
WHERE r.nome = 'ADMIN'
  AND p.nome IN (
                 'CREATE_PERMISSION',
                 'READ_PERMISSION',
                 'UPDATE_PERMISSION'
    )
    ON CONFLICT DO NOTHING;