import { writable } from 'svelte/store'
import { onSetup } from '../common/setup.js'
import type { Field } from '../model/Field.js'
import { defaultSchemas } from '../model/Schema.js'
import { currentSchema } from './schemas.js'

export const fields = writable<Field[]>(defaultSchemas.default)

onSetup(() => {
	// Update fields when schema changes
	currentSchema.subscribe($schema => {
		if (!$schema) return
		fields.update(fields => $schema.map(field => {
			const f = fields.find(f => f.name === field.name && f.type === field.type)
			return f ? { ...(f as any), ...field } : field
		}))
	})
})