import type { Field, Message } from '../../common/data.js'
import { createOverlay, hasText } from '../../common/dom.js'

let callback: (text: string) => void

export function pickText(field: Field) {
	return new Promise<Message>((resolve) => {
		callback = (text: string) => {
			resolve({ action: 'setField', payload: { ...field, value: text } })
		}
		document.body.addEventListener('click', onClick)
		document.body.addEventListener('mouseover', onMouseOver)
		document.addEventListener('selectionchange', onSelectionChange)
	})
}

let overlay: HTMLElement | null = null

function onClick(event: MouseEvent) {
	event.preventDefault()
	document.body.removeEventListener('click', onClick)
	document.body.removeEventListener('mouseover', onMouseOver)
	document.removeEventListener('selectionchange', onSelectionChange)
	document.getSelection()?.removeAllRanges()
	if (!overlay) return
	overlay?.remove()
	overlay = null
	const targetElement = event.target as HTMLElement
	const text = targetElement.innerText
	if (!text) return
	callback(text)
}

function onMouseOver(event: MouseEvent) {
	const targetElement = event.target as HTMLElement
	if (!hasText(targetElement)) return
	const elementContent = targetElement.innerText.trim()
	if (!elementContent) return
	targetElement.style.cursor = 'text'
	const r = targetElement.getBoundingClientRect()
	console.log(targetElement.nodeName, targetElement.childNodes.length,
		targetElement.children.length)
	if (overlay) overlay.remove()
	overlay = createOverlay(r)
}

function onSelectionChange() {
	const selection = document.getSelection()
	if (selection && selection.toString()) {
		console.log(selection.toString())
		callback(selection.toString())
		document.body.removeEventListener('mouseover', onMouseOver)
		overlay?.remove()
		overlay = null
	}
}
