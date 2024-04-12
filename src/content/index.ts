
// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
import type { Message } from '../common/data'
import { pickers } from './pickers/index.js'
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
	console.log('pick', picker, action, payload)
	if (picker in pickers) {
		const msg = await pickers[picker](payload)
		chrome.runtime.sendMessage(msg).catch(console.error)
	}
})
