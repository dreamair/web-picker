import { derived, get, writable } from 'svelte/store'
import { updateField } from '../model/Field.js'
import type { Schemas } from '../model/Schema.js'
import {
	defaultSchemas,
	removeSchemaField,
	updateSchemaField
} from '../model/Schema.js'
import { fields } from './fields.js'

export const schemas = writable<Schemas>(defaultSchemas)

export const currentSchemaKey = writable<string>()

export const currentSchema = derived([schemas, currentSchemaKey],
	([$schemas, $currentSchemaKey]) => $schemas?.[$currentSchemaKey])


export function addSchema(newKey: string | null) {
	if (!newKey) return
	const lastKey = get(currentSchemaKey)
	schemas.update(schemas => newKey in schemas
		? schemas
		: {
			...schemas,
			[newKey]: lastKey ? [...schemas[lastKey]] : schemas.default
		})
	currentSchemaKey.set(newKey)
}

export function removeSchema(key: string | null) {
	if (!key || key === 'default') return
	schemas.update(schemas => {
		const newSchemas = { ...schemas }
		delete newSchemas[key]
		return newSchemas
	})
	const $schemas = get(schemas)
	currentSchemaKey.set(Object.keys($schemas)[0] || 'default')
}

export function removeFieldInCurrentSchema(fieldName: string) {
	if (!fieldName) return
	const key = get(currentSchemaKey)
	if (!key) return
	schemas.update(schemas => removeSchemaField(schemas, key, fieldName))
}

export function renameFieldInCurrentSchema(fieldName: string, newName: string) {
	if (!fieldName) return
	const key = get(currentSchemaKey)
	if (!key) return
	const data = { name: newName }
	fields.update(fields => updateField(fields, fieldName, data))
	schemas.update(schemas => updateSchemaField(schemas, key, fieldName, data))
}