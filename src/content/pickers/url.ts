import type { Field, Message } from '../../common/data.js'
import { createOverlay } from '../../common/dom.js'

let callback: (url: string) => void

export function pickUrl(field: Field) {
	return new Promise<Message>((resolve) => {
		callback = (url) => {
			resolve({
				action: 'setField',
				payload: { ...field, value: url, source: location.href }
			})
		}
		document.body.addEventListener('click', onClick, true)
		document.body.addEventListener('mouseover', onMouseOver)
	})
}

let overlay: HTMLElement | null = null
let element: HTMLAnchorElement | null = null

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
	const url = element.href.trim()
	if (!url) return
	callback(url)
}

function onMouseOver(event: MouseEvent) {
	const targetElement = findLinkElement(event.target as HTMLElement)
	if (!targetElement) return
	targetElement.style.cursor = 'default'
	const r = targetElement.getBoundingClientRect()
	console.log(targetElement.nodeName, targetElement.childNodes.length,
		targetElement.children.length)
	element = targetElement as HTMLAnchorElement
	if (overlay) overlay.remove()
	overlay = createOverlay(r)
}

function findLinkElement(element: HTMLElement | null) {
	while (element &&
		(element.tagName !== 'A' || !element.getAttribute('href')?.trim()))
		element = element.parentElement
	return element
}