import type { Field, Message } from '../../common/data.js'
import { createOverlay, hasText } from '../../common/dom.js'

let callback: (value: number) => void

export function pickNumber(field: Field) {
	return new Promise<Message>((resolve) => {
		callback = (value: number) => {
			resolve({ action: 'setField', payload: { ...field, value } })
		}
		document.body.addEventListener('click', onClick, true)
		document.body.addEventListener('mousemove', onMouseMove)
		document.addEventListener('selectionchange', onSelectionChange)
	})
}

let overlay: HTMLElement | null = null
let element: HTMLElement | null = null

function onClick(event: MouseEvent) {
	event.preventDefault()
	event.stopImmediatePropagation()
	event.stopPropagation()
	document.body.removeEventListener('click', onClick)
	document.body.removeEventListener('mousemove', onMouseMove)
	document.removeEventListener('selectionchange', onSelectionChange)
	document.getSelection()?.removeAllRanges()
	if (!overlay) return
	overlay?.remove()
	overlay = null
	if (!element) return
	const value = extractNumber(element.innerText)
	if (value !== null)
		callback(value)
}

function onMouseMove(event: MouseEvent) {
	const elements =
		document.elementsFromPoint(event.clientX, event.clientY) as HTMLElement[]
	const targetElement = elements.find(hasText)
	if (!targetElement) return
	const elementContent = targetElement.innerText.trim()
	if (extractNumber(elementContent) === null) return
	targetElement.style.cursor = 'text'
	const r = targetElement.getBoundingClientRect()
	console.log(targetElement.nodeName, targetElement.childNodes.length,
		targetElement.children.length)
	element = targetElement
	if (overlay) overlay.remove()
	overlay = createOverlay(r)
}

function onSelectionChange() {
	const selection = document.getSelection()
	if (selection && selection.toString()) {
		console.log(selection.toString())
		const value = extractNumber(selection.toString())
		if (value === null) return
		callback(value)
		document.body.removeEventListener('mousemove', onMouseMove)
		overlay?.remove()
		overlay = null
	}
}

function extractNumber(text: string) {
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
