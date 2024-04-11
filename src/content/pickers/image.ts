import type { Field, Message } from '../../common/data.js'
import { createOverlay } from '../../common/dom.js'

let callback: (url: string, alt?: string | null) => void

export function pickImage(field: Field) {
	return new Promise<Message>((resolve) => {
		callback = (url, alt) => {
			resolve({
				action: 'setField',
				payload: {
					...field,
					value: { type: 'image', url, src: location.href, alt }
				}
			})
		}
		document.body.addEventListener('click', onClick)
		document.body.addEventListener('mouseover', onMouseOver)
	})
}

let overlay: HTMLElement | null = null

function onClick(event: MouseEvent) {
	event.preventDefault()
	document.body.removeEventListener('click', onClick)
	document.body.removeEventListener('mouseover', onMouseOver)
	document.getSelection()?.removeAllRanges()
	if (!overlay) return
	overlay?.remove()
	overlay = null
	const targetElement = event.target as HTMLElement
	if (targetElement.tagName !== 'IMG') return
	const url = targetElement.getAttribute('src')?.trim()
	if (!url) return
	callback(new URL(url, location.href).href,
		targetElement.getAttribute('alt')?.trim())
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
	if (overlay) overlay.remove()
	overlay = createOverlay(r)
}

