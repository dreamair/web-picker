// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/

import contentFile from '../../build/content.js?url'
import { debug } from '../common/debug.js'
import contentCss from '../content/styles.css?raw'
import type { Message } from '../model/Message.js'

debug('background script loaded')

// toggle the side panel from the extension's action button,
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

let isActive = false

chrome.runtime.onMessage.addListener((message: Message, sender) => {
  debug('message', message.action, message, 'sender', sender.tab?.id, isActive)
  // only messages from the extension
  if (sender.tab)
    return
  if (message.action === 'activate-sidepanel') {
    if (!isActive && message.payload) {
      chrome.tabs.onUpdated.addListener(onUpdated)
      chrome.tabs.onActivated.addListener(onActivated)
    }
    else if (isActive && !message.payload) {
      chrome.tabs.onUpdated.removeListener(onUpdated)
      chrome.tabs.onActivated.removeListener(onActivated)
    }
    isActive = message.payload
  }
  if (!isActive && message.action !== 'activate-sidepanel')
    return
  // send this to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0]
    if (!tab?.id) {
      if (!message.isOptional)
        console.error('Failed to send message: No active tab found',
          message.action, message.payload)
      return
    }
    if (!tab?.url || tab.url.startsWith('chrome://'))
      return
    await injectContent(tab.id)
    debug('sending message to tab', tab.id, tab.active, tab.highlighted)
    chrome.tabs.sendMessage(tab.id, message)
      .catch(console.error)
  })
})

async function onUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab) {
  debug('tab updated', tabId, isActive, changeInfo, tab)
  if (!tab.url || tab.url.startsWith('chrome://'))
    return
  if (!isActive)
    return
  if (changeInfo.status === "complete") {
    debug(`Tab reloaded: ${tabId}, URL: ${tab.url}`, tab)
    await injectContent(tabId)
  }
}

async function onActivated({ tabId }: chrome.tabs.TabActiveInfo) {
  debug("Switched to tab ID:", tabId)
  if (!isActive)
    return
  const tab = await chrome.tabs.get(tabId)
  if (!tab.url || tab.url.startsWith('chrome://'))
    return
  await injectContent(tabId)
  chrome.tabs.sendMessage(tabId, { action: 'activate-tab', payload: true })
    .catch(console.error)
  // for side panel
  chrome.runtime.sendMessage({ action: 'activate-tab', payload: true })
    .catch(console.error)
}

async function injectContent(tabId: number) {
  const target = { tabId }
  const needsInjection = await chrome.scripting.executeScript(
    { target, func: () => !(window as any).__web_picker__ })
  if (!needsInjection[0].result) return false
  await chrome.scripting.insertCSS(
    { target, css: contentCss as string })
    .catch(console.error)
  debug('injected css into tab', tabId)
  const result = await chrome.scripting.executeScript(
    { target, files: [contentFile] })
    .catch(console.error)
  debug('injected script into tab', tabId, result)
  await chrome.scripting.executeScript(
    { target, func: () => { (window as any).__web_picker__ = true } })
    .catch(console.error)
  return true
}
