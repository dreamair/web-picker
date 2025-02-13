
// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
import { debug, isDebug } from '../common/debug.js'
import type { Message } from '../model/Message'
import { cancelPickers, pickers } from './pickers/index.js'

if (isDebug) {
  document.addEventListener('focus', (event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' ||
      target.isContentEditable)
      console.log('Focused on:', target)
  }, true)
}

window.addEventListener("message", (event) => {
  console.log('window message', event.data, event.source === window)
  if (event.source !== window) return // Ensure it's from the same page
  if (event.data.action === 'offer-actions')
    chrome.runtime.sendMessage(event.data).catch(console.error)
})

chrome.runtime.onMessage.addListener(async ({ action, payload }: Message,
  sender) => {
  console.log('content message', action, payload, sender)
  if (!action) return
  if (sender.tab) return
  if (action.startsWith('activate-') || action.startsWith('execute-')) {
    window.postMessage({ action, payload })
    return
  }
  if (action.startsWith('pick-')) action = action.slice(5)
  const picker: keyof typeof pickers = action === 'pick'
    ? payload.type
    : action in pickers ? action : null
  if (picker in pickers) {
    debug('pick', picker, action, payload)
    const msg = await pickers[picker](payload)
    chrome.runtime.sendMessage(msg).catch(console.error)
  }
  if (action === 'cancel-pickers') {
    debug('cancel-pickers', payload)
    cancelPickers()
  }
})
