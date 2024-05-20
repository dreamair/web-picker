import { derived, writable } from 'svelte/store'
import { updateField } from '../model/Field.js'
import type { Schemas } from '../model/Schema.js'
import { defaultSchemas, updateSchemaField } from '../model/Schema.js'
import { fields } from './fields.js'

export const schemas = writable<Schemas>(defaultSchemas)

export const currentSchemaKey = writable<string>()

export const currentSchema = derived([schemas, currentSchemaKey],
	([$schemas, $currentSchemaKey]) => $schemas?.[$currentSchemaKey])


export function renameField(key: string, fieldName: string, newName: string) {
	const data = { name: newName }
	fields.update(fields => updateField(fields, fieldName, data))
	schemas.update(schemas => updateSchemaField(schemas, key, fieldName, data))
}