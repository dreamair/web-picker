import { derived, writable } from 'svelte/store'
import { onSetup } from '../common/setup.js'
import type { Schemas } from '../model/Schema.js'
import { defaultSchemas, equalSchema } from '../model/Schema.js'
import { fields } from './fields.js'

export const schemas = writable<Schemas>(defaultSchemas)

export const currentSchemaKey = writable<string>()

export const currentSchema = derived([schemas, currentSchemaKey],
	([$schemas, $currentSchemaKey]) => $schemas?.[$currentSchemaKey])

onSetup(() => {
	// Update schemas when fields change
	derived([fields, schemas, currentSchemaKey],
		([$data, $schemas, $key]) => {
			if (!$data || !$schemas || !$key) return null
			if (equalSchema($data, $schemas[$key]))
				return null
			return {
				...$schemas,
				[$key]: $data.map(f => ({ name: f.name, type: f.type }))
			}
		})
		.subscribe($schemas => {
			if ($schemas)
				schemas.set($schemas)
		})
})