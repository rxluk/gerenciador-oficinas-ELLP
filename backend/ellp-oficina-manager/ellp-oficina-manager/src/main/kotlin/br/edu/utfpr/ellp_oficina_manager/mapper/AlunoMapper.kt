package br.edu.utfpr.ellp_oficina_manager.mapper

import br.edu.utfpr.ellp_oficina_manager.jooq.tables.records.AlunoRecord
import br.edu.utfpr.ellp_oficina_manager.model.aluno.Aluno

fun AlunoRecord.toModel(): Aluno =
    Aluno(
        id = this.id,
        nome = this.nome,
        idade = this.idade,
        serie = this.serie,
        telefone = this.telefone,
        email = this.email,
        endereco = this.endereco,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,

    )