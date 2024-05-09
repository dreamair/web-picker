import type { Writable } from 'svelte/store'
import type { Area, Command, Field } from './data.js'
import { getField, updateField, updateFields } from './data.js'
import { cropImage } from './imageUtils.js'

export function setupMessages(data: Writable<Field[]>,
	activeCommand: Writable<Command | null>) {
	// send
	activeCommand.subscribe(cmd => {
		if (cmd) {
			data.subscribe(fields => {
				const key = cmd.key
				const field = key ? getField(fields, key) : undefined
				console.log('command message', cmd.action, field)
				chrome.runtime.sendMessage(
					{ action: cmd.action, payload: field })
					.catch(console.error)
			})()
		}
		else {
			console.log('cancel command')
			chrome.runtime.sendMessage({ action: 'cancel-pickers' })
				.catch(console.error)
		}
	})
	// receive
	const handlers: Record<string, (payload: any) => void> = {
		setField: (field: Field) => {
			console.log('set field', field)
			data.update(fields => updateField(fields, field.name, field))
			activeCommand.set(null)
		},
		setFields: (newFields: Field[]) => {
			console.log('set fields', newFields)
			data.update(fields => updateFields(fields, newFields))
			activeCommand.set(null)
		},
		takeScreenshot: async ({ field, area }: { field: Field; area: Area }) => {
			console.log('Taking screenshot...', area)
			const dataUrl = await chrome.tabs.captureVisibleTab()
			const url = await cropImage(dataUrl, area)
			console.log('set screenshot', field)
			data.update(fields => updateField(fields, field.name, { value: url }))
			activeCommand.set(null)
		},
		cancel: (field: Field) => {
			console.log('cancel', field)
			activeCommand.set(null)
		},
	}
	const onMessage = (message: any) => {
		if (message.action in handlers) handlers[message.action](message.payload)
	}
	chrome.runtime.onMessage.removeListener(onMessage)
	chrome.runtime.onMessage.addListener(onMessage)
}