import type { Field, FieldType, ImageField, UrlField } from '../model/Field.js'
import { isNotEmpty, isValid, normalize } from '../model/Field.js'


export function exportJson(fields: Field[]) {
	fields = fields.map(normalize).filter(isValid).filter(isNotEmpty)
	const obj = fields.reduce((obj, field) => {
		if (field.value === undefined || field.value === null) return obj
		const val = { ...field } as Omit<Field, 'name'> & { name?: string }
		if (typeof field.value === 'string') {
			val.value = field.value.trim()
			if (val.value === '') return obj
		}
		if (val.source && val.value === val.source) delete val.source
		delete val.name
		return { ...obj, [field.name.trim()]: val }
	}, {} as Record<string, Omit<Field, 'name'>>)
	return JSON.stringify(obj, null, 2)
}

export function exportCsv(fields: Field[], inclHeaders = true) {
	fields = fields.map(normalize).filter(isValid)
	const values = fields
		.map(f => typeof f.value === 'string' ? f.value.trim() : f.value)
		.map(v => v && typeof v === 'string'
			? `"${v}"`
			: typeof v === 'number' ? `${v}` : '')
		.join(',')
	return inclHeaders
		? `${values}\n`
		: `${fields.map(field => field.name).join(',')}\n${values}\n`
}

const mdByType = {
	url: (f: UrlField) => `[${f.name}](${f.value})\n`,
	image: (f: ImageField) => `![${f.alt ?? f.name}](${f.value})\n`,
} as Partial<Record<FieldType, (f: any) => string>>

export function exportMd(fields: Field[]) {
	fields = fields.map(normalize).filter(isValid).filter(isNotEmpty)
	const title = fields.find(f => f.name.toLowerCase() === 'title')
	const url = fields.find(f => f.name.toLowerCase() === 'url')
	const description = fields.find(f => f.name.toLowerCase() === 'description')
	const lines = []
	if (title && url) lines.push(`## [${title.value}](${url.value})`)
	else if (title) lines.push(`## ${title.value}`)
	if (title && description) lines.push(description.value)
	if (lines.length) lines.push('')
	lines.push(...fields
		.filter(f => f !== title
			&& (f !== description || !title)
			&& (f !== url || !title))
		.map(f => {
			const name = f.name.trim()
			const value = f.value && typeof f.value === 'string'
				? f.value.trim()
				: f.value ?? ''
			return !name || !value
				? ''
				: f.type in mdByType
					? mdByType[f.type]?.(f)
					: `### ${name}\n${value}\n`
		}))
	return lines.join('\n')
}
