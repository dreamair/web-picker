
// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
import type { Message } from '../model/Message'
import { cancelPickers, pickers } from './pickers/index.js'
import './styles.css'

// Some JS on the page
// storage.get().then(console.log);

// Some svelte component on the page
// new Overlay({ target: document.body });

chrome.runtime.onMessage.addListener(async ({ action, payload }: Message) => {
	if (action.startsWith('pick-')) action = action.slice(5)
	const picker: keyof typeof pickers = action === 'pick'
		? payload.type
		: action in pickers ? action : null
	if (picker in pickers) {
		console.log('pick', picker, action, payload)
		const msg = await pickers[picker](payload)
		chrome.runtime.sendMessage(msg).catch(console.error)
	}
	if (action === 'cancel-pickers') {
		console.log('cancel', payload)
		cancelPickers()
	}
})
