// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/

import contentFile from '../../build/content.js?url'
import contentCss from '../content/styles.css?raw'

console.log('background script loaded')
chrome.runtime.onInstalled.addListener(() => {
})

// toggle the side panel from the extension's action button,
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

let isActive = false

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('message', message.action, message, 'sender', sender.tab?.id)
  if (message.action === 'activate')
    isActive = message.payload
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
    console.log('sending message to tab', tab.id, tab.active, tab.highlighted)
    chrome.tabs.sendMessage(tab.id, message)
      .catch(console.error)
  })
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('tab updated', tabId, isActive, changeInfo, tab)
  if (!tab.url || tab.url.startsWith('chrome://'))
    return
  if (!isActive)
    return
  if (changeInfo.status === "complete") {
    console.log(`Tab reloaded: ${tabId}, URL: ${tab.url}`, tab)
    await injectContent(tabId)
  }
})

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log("Switched to tab ID:", activeInfo.tabId)
  if (!isActive)
    return
  const tab = await chrome.tabs.get(activeInfo.tabId)
  if (!tab.url || tab.url.startsWith('chrome://'))
    return
  await injectContent(activeInfo.tabId)
})

async function injectContent(tabId: number) {
  const isPlain = await chrome.scripting.executeScript(
    { target: { tabId }, func: () => !(window as any).__web_picker__ })
  if (!isPlain[0].result) return
  await chrome.scripting.insertCSS({
    target: { tabId },
    css: contentCss as string
  })
  console.log('injected css into tab', tabId)
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    files: [contentFile],
  })
  console.log('injected script into tab', tabId, result)
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => { (window as any).__web_picker__ = true },
  })
}
