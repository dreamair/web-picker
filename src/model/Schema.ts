import type { FieldType } from './Field.js'

export type Schema = { name: string; type: FieldType }[]

export type Schemas = Record<string, Schema>

export const defaultSchemas = {
	default: [
		{ name: 'title', type: 'string' },
		{ name: 'description', type: 'text' },
		{ name: 'image', type: 'image' },
		{ name: 'url', type: 'url' },
	],
	product: [
		{ name: 'title', type: 'string' },
		{ name: 'description', type: 'text' },
		{ name: 'image', type: 'image' },
		{ name: 'price', type: 'number' },
		{ name: 'url', type: 'url' },
	],
} satisfies Schemas

export function equalSchema(a: Schema, b: Schema) {
	if (!a || !b) return false
	if (a.length !== b.length) return false
	for (let i = 0; i < a.length; i++) {
		const fa = a[i]
		const fb = b[i]
		if (fa.name !== fb.name || fa.type !== fb.type) return false
	}
	return true
}

