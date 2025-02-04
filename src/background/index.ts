// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/

import contentFile from '../../build/content.js?url'
import { debug } from '../common/debug.js'
import contentCss from '../content/styles.css?raw'

debug('background script loaded')

// toggle the side panel from the extension's action button,
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

let isActive = false

chrome.runtime.onMessage.addListener((message, sender) => {
  debug('message', message.action, message, 'sender', sender.tab?.id)
  if (message.action === 'activate') {
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
  if (sender.tab)
    return
  if (!isActive)
    return
  // send this to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0]
    if (!tab?.id || !tab.url || tab.url.startsWith('chrome://')) {
      if (!message.isOptional)
        console.error('Failed to send message: No active tab found')
      return
    }
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

async function onActivated(activeInfo: chrome.tabs.TabActiveInfo) {
  debug("Switched to tab ID:", activeInfo.tabId)
  if (!isActive)
    return
  const tab = await chrome.tabs.get(activeInfo.tabId)
  if (!tab.url || tab.url.startsWith('chrome://'))
    return
  await injectContent(activeInfo.tabId)
}

async function injectContent(tabId: number) {
  const isPlain = await chrome.scripting.executeScript(
    { target: { tabId }, func: () => !(window as any).__web_picker__ })
  if (!isPlain[0].result) return
  await chrome.scripting.insertCSS({
    target: { tabId },
    css: contentCss as string
  })
  debug('injected css into tab', tabId)
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    files: [contentFile],
  })
  debug('injected script into tab', tabId, result)
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => { (window as any).__web_picker__ = true },
  })
}
