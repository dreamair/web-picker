import type { Field } from '../../common/data.js'
import { hasText } from '../../common/dom.js'
import { domToMd } from '../common/domToMd.js'
import { pickElement } from './pickElement.js'

export async function pickText(field: Field) {
	const element = await pickElement(elements => {
		const element = elements.find(hasText)
		return element && element.innerText.trim() ? element : null
	})
	const value = domToMd(element)
	return value
		? { action: 'setField', payload: { ...field, value } }
		: { action: 'cancel', payload: field }
}

