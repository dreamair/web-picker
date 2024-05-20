import { derived, writable } from 'svelte/store'
import { onSetup } from '../common/setup.js'
import type { Field } from '../model/Field.js'
import { applySchema } from '../model/Field.js'
import { defaultSchemas } from '../model/Schema.js'
import { currentSchema } from './schemas.js'

export const fields = writable<Field[]>(defaultSchemas.default)

export const activeFields = derived(fields, $fields =>
	$fields.filter(field => !field.isPassive))

onSetup(() => {
	// Update fields when schema changes
	currentSchema.subscribe($schema => {
		fields.update(fields => applySchema(fields, $schema))
	})
})