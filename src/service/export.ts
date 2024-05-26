import type { Field, FieldType, ImageField, UrlField } from '../model/Field.js'


export function exportJson(fields: Field[]) {
	const obj = fields.reduce((obj, field) => {
		if (!field.name) return obj
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
	fields = fields.map(f => ({ ...f, name: f.name.trim() })).filter(f => f.name)
	const values = fields
		.map(f => typeof f.value === 'string' ? f.value.trim() : f.value)
		.map(v => v && typeof v === 'string'
			? `"${v}"`
			: typeof v === 'number' ? `${v}` : '')
		.join(',')
	return inclHeaders
		? `${values}\n`
		: `${fields.map(field => field.name.trim()).join(',')}\n${values}\n`
}

const mdByType = {
	url: (f: UrlField) => `[${f.name}](${f.value})\n`,
	image: (f: ImageField) => `![${f.alt ?? f.name}](${f.value})\n`,
} as Partial<Record<FieldType, (f: any) => string>>

export function exportMd(fields: Field[]) {
	return fields
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
		})
		.join('\n')
}
