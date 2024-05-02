import type { Field, ImageField, Message } from '../../common/data.js'
import { createOverlay } from '../../common/dom.js'

let callback: (url: string, alt?: string | null) => void

export function pickImage(field: Field) {
	return new Promise<Message>((resolve) => {
		callback = (url, alt) => {
			resolve({
				action: 'setField',
				payload: {
					...field,
					type: 'image', value: url, source: location.href, alt
				} as ImageField
			})
		}
		document.body.addEventListener('click', onClick, true)
		document.body.addEventListener('mouseover', onMouseOver)
	})
}

let overlay: HTMLElement | null = null
let element: HTMLImageElement | null = null

function onClick(event: MouseEvent) {
	event.preventDefault()
	event.stopImmediatePropagation()
	event.stopPropagation()
	document.body.removeEventListener('click', onClick)
	document.body.removeEventListener('mouseover', onMouseOver)
	document.getSelection()?.removeAllRanges()
	if (!overlay) return
	overlay?.remove()
	overlay = null
	if (!element) return
	callback(element.src, element.alt?.trim())
}

function onMouseOver(event: MouseEvent) {
	const targetElement = event.target as HTMLElement
	if (targetElement.tagName !== 'IMG') return
	const url = targetElement.getAttribute('src')?.trim()
	if (!url) return
	targetElement.style.cursor = 'default'
	const r = targetElement.getBoundingClientRect()
	console.log(targetElement.nodeName, targetElement.childNodes.length,
		targetElement.children.length)
	element = targetElement as HTMLImageElement
	if (overlay) overlay.remove()
	overlay = createOverlay(r)
}

