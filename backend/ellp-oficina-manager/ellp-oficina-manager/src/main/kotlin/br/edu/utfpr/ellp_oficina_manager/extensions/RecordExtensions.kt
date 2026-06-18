package br.edu.utfpr.ellp_oficina_manager.extensions

import org.jooq.Field
import org.jooq.Record

fun <T> Record.getIfPresent(field: Field<T>): T? =
    if (field in fields()) this[field] else null

