
export interface StringField {
	type: 'string'
	name: string
	value?: string
	source?: string
}

export interface TextField {
	type: 'text'
	name: string
	value?: string
	source?: string
}

export interface NumberField {
	type: 'number'
	name: string
	value?: number
	source?: string
}

export interface UrlField {
	type: 'url'
	name: string
	value?: string
	source?: string
}

export interface ImageField {
	type: 'image'
	name: string
	value?: string
	source?: string
	alt?: string
}

export type Field = StringField | TextField | NumberField |
	ImageField | UrlField

export type FieldType = Field['type']

export function isStringField(field?: Field): field is StringField {
	return field?.type === 'string'
}

export function isTextField(field?: Field): field is TextField {
	return field?.type === 'text'
}

export function isUrlField(field?: Field): field is UrlField {
	return field?.type === 'url'
}

export function isImageField(field?: Field): field is ImageField {
	return field?.type === 'image'
}

export function stringField(name: string, value?: string) {
	return value ? { type: 'string', name, value } : undefined
}

export function textField(name: string, value?: string) {
	return value ? { type: 'text', name, value } : undefined
}

export function numberField(name: string, value?: string) {
	return value
		? { type: 'number', name, value: value ? parseInt(value) : undefined }
		: undefined
}

export function urlField(name: string, url?: string, baseUrl?: string) {
	return url
		? {
			type: 'url',
			name, value: baseUrl ? new URL(url, baseUrl).href : url,
			source: baseUrl,
		}
		: undefined
}

export function imageField(name: string, url?: string, baseUrl?: string) {
	return url
		? {
			type: 'image',
			name, value: baseUrl ? new URL(url, baseUrl).href : url,
			source: baseUrl,
		}
		: undefined
}

export function getField(fields: Field[], name: string) {
	return fields.find(f => f.name === name)
}

export function updateField(fields: Field[], name: string, data: object) {
	return fields.map(f => f.name === name ? { ...f, ...data } : f)
}

export function updateFields(fields: Field[], newFields: Field[]) {
	const newFieldsMap = new Map(newFields.map(f => [f.name, f]))
	return fields.map(f => newFieldsMap.has(f.name)
		? { ...f, ...newFieldsMap.get(f.name) }
		: f) as Field[]
}

export function removeField(fields: Field[], name: string) {
	const idx = fields.findIndex(f => f.name === name)
	if (idx === -1) return fields
	const newFields = [...fields]
	newFields.splice(idx, 1)
	return newFields
}
