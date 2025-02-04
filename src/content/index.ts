
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

chrome.runtime.onMessage.addListener(async ({ action, payload }: Message) => {
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
