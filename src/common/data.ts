import { writable } from 'svelte/store'

export interface StringValue {
	type: 'string'
	text?: string
	source?: string
}

export interface TextValue {
	type: 'text'
	text?: string
	source?: string
}

export interface UrlValue {
	type: 'url'
	url?: string
	source?: string
}

export interface ImageValue {
	type: 'image'
	url?: string
	source?: string
	alt?: string
}

export type FieldValue = StringValue | TextValue | ImageValue | UrlValue

export interface Field<V extends FieldValue = any> {
	key: string
	value: V
}

export function isStringField(field?: FieldValue): field is StringValue {
	return field?.type === 'string'
}

export function isTextField(field?: FieldValue): field is TextValue {
	return field?.type === 'text'
}

export function isUrlField(field?: FieldValue): field is UrlValue {
	return field?.type === 'url'
}

export function stringValue(text?: string) {
	return text ? { type: 'string', text } : undefined
}

export function textValue(text?: string) {
	return text ? { type: 'text', text } : undefined
}

export function urlValue(url?: string, baseUrl?: string) {
	return url
		? {
			type: 'url',
			url: baseUrl ? new URL(url, baseUrl).href : url,
			source: baseUrl,
		}
		: undefined
}

export function imageValue(url?: string, baseUrl?: string) {
	return url
		? {
			type: 'image',
			url: baseUrl ? new URL(url, baseUrl).href : url,
			source: baseUrl,
		}
		: undefined
}

export const data = writable<Record<string, FieldValue>>({
	url: { type: 'url' },
	title: { type: 'string' },
	description: { type: 'text' },
	image: { type: 'image' },
})


export type Command = {
	action: 'pick' | 'pick-screenshot' | 'pick-pageData'
	key?: string
}

export const activeCommand = writable<Command | null>(null)

export function toggleCommand(cmd: Command) {
	return (lastCmd: Command | null) =>
		lastCmd?.key === cmd.key && lastCmd?.action === cmd.action ? null : cmd
}


export interface Message {
	action: string
	payload: any
}


export interface Area {
	left: number
	top: number
	width: number
	height: number
}

export function scaleArea(area: Area, scale: number): Area {
	return {
		left: area.left * scale,
		top: area.top * scale,
		width: area.width * scale,
		height: area.height * scale,
	}
}
