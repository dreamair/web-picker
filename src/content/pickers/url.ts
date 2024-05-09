import type { Field } from '../../common/data.js'
import { pickElement } from './pickElement.js'

export async function pickUrl(field: Field) {
	const element = await pickElement(elements => {
		const element = elements.find(e =>
			e?.tagName === 'A' && 'href' in e && (e.href as string)?.trim())
		return element ?? null
	}) as HTMLAnchorElement | null
	return element
		? {
			action: 'setField',
			payload: { ...field, value: element.href, source: location.href }
		}
		: { action: 'cancel', payload: field }
}

