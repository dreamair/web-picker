import { derived, writable } from 'svelte/store'
import type { Schemas } from '../model/Schema.js'
import { defaultSchemas } from '../model/Schema.js'

export const schemas = writable<Schemas>(defaultSchemas)

export const currentSchemaKey = writable<string>()

export const currentSchema = derived([schemas, currentSchemaKey],
	([$schemas, $currentSchemaKey]) => $schemas?.[$currentSchemaKey])
