import type { Field } from '../../common/data.js'
import { hasText } from '../../common/dom.js'
import { pickElement } from './pickElement.js'

export async function pickNumber(field: Field) {
	const element = await pickElement(elements => {
		const element = elements.find(hasText)
		return element && extractNumber(element.innerText) !== null ? element : null
	})
	const value = extractNumber(element?.innerText)
	return value === null
		? { action: 'cancel', payload: field }
		: { action: 'setField', payload: { ...field, value } }
}

function extractNumber(text?: string | null) {
	if (!text) return null
	// TODO: handle other number formats
	text = text.replace(/[\s'’]/g, '')
	const match = text.match(/\d+([.,]\d*)*/)
	if (!match) return null
	text = match[0]
	const commaIdx = text.indexOf(',')
	const pointIdx = text.indexOf('.')
	if (commaIdx !== -1 && pointIdx !== -1)
		text = commaIdx > pointIdx ? text.replace('.', '') : text.replace(',', '')
	if (commaIdx !== -1)
		text = text.replace(',', '.')
	const val = commaIdx !== -1 || pointIdx !== -1
		? parseFloat(text)
		: parseInt(text)
	return isNaN(val) ? null : val
}
