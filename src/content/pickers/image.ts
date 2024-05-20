import type { Field } from '../../model/Field.js'
import { pickElement } from './pickElement.js'

export async function pickImage(field: Field) {
	const element = await pickElement<HTMLImageElement>(elements => {
		const element = elements.find(e => e.tagName === 'IMG')
		return element && 'src' in element && element.src ? element : null
	})
	const value = element?.src
	const alt = element?.alt
	return value === null
		? { action: 'cancel', payload: field }
		: {
			action: 'setField',
			payload: { ...field, value, alt, source: location.href }
		}
}
