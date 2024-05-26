import { style } from '../../common/dom.js'
import type { Area } from '../../model/Area.js'
import { scaleArea } from '../../model/Area.js'
import type { Field } from '../../model/Field.js'
import type { Message } from '../../model/Message.js'

let curtainOverlay: HTMLElement | null = null
let areaOverlay: HTMLElement | null = null
let callback: (area: Area | null) => void

export function pickScreenshot(field: Field) {
	return new Promise<Message>((resolve) => {
		callback = area => {
			cleanup()
			if (area) {
				setTimeout(() => {
					resolve({ action: 'takeScreenshot', payload: { field, area } })
				}, 100)
			}
			else {
				resolve({ action: 'cancel', payload: field })
			}
		}
		if (curtainOverlay) curtainOverlay.remove()
		curtainOverlay = document.createElement('div')
		curtainOverlay.className = 'web-picker-capture-overlay'
		document.body.appendChild(curtainOverlay)
		document.body.addEventListener('mousedown', onMarkStart)
	})
}

export function cancelScreenshotPicker() {
	cleanup()
}

function cleanup() {
	document.body.removeEventListener('mousedown', onMarkStart)
	document.body.removeEventListener('mousemove', onMarking)
	document.body.removeEventListener('mouseup', onMarkEnd)
	areaOverlay?.remove()
	areaOverlay = null
	curtainOverlay?.remove()
	curtainOverlay = null
}

function onMarkStart(event: MouseEvent) {
	event.preventDefault()
	event.stopPropagation()
	document.body.removeEventListener('mousedown', onMarkStart)
	if (areaOverlay) areaOverlay.remove()
	console.log('start', event.clientY, event.y)
	areaOverlay = document.createElement('div')
	areaOverlay.className = 'web-picker-capture-area'
	style(areaOverlay,
		{ left: event.clientX, top: event.clientY, width: 0, height: 0 })
	curtainOverlay?.appendChild(areaOverlay)
	if (!curtainOverlay) return
	style(curtainOverlay,
		{ borderLeftWidth: event.clientX, borderTopWidth: event.clientY })
	document.body.addEventListener('mousemove', onMarking)
	document.body.addEventListener('mouseup', onMarkEnd)
}

function onMarking(event: MouseEvent) {
	event.preventDefault()
	event.stopPropagation()
	if (!areaOverlay) return
	// const r = areaOverlay.getBoundingClientRect()
	// console.log('move', areaOverlay.offsetTop, event.clientY, r.top)
	style(areaOverlay, {
		width: Math.abs(event.clientX - areaOverlay.offsetLeft),
		height: Math.abs(event.clientY - areaOverlay.offsetTop),
	})
	if (!curtainOverlay) return
	style(curtainOverlay, {
		borderRightWidth: curtainOverlay.offsetWidth - event.clientX,
		borderBottomWidth: curtainOverlay.offsetHeight - event.clientY
	})
}

function onMarkEnd(event: MouseEvent) {
	event.preventDefault()
	event.stopPropagation()
	if (areaOverlay) {
		const r = areaOverlay.getBoundingClientRect()
		const s = window.devicePixelRatio
		callback(scaleArea(r, s))
	}
	else {
		callback(null)
	}
}
