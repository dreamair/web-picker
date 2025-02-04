import { debug } from '../common/debug.js'
import { cropImage } from '../common/imageUtils.js'
import { onSetup } from '../common/setup.js'
import type { Area } from '../model/Area.js'
import type { Field } from '../model/Field.js'
import { getField, updateField, updateFields } from '../model/Field.js'
import { activeCommand } from '../state/command.js'
import { fields } from '../state/fields.js'

onSetup(() => {
  // send
  activeCommand.subscribe(cmd => {
    if (cmd) {
      fields.subscribe(fields => {
        const key = cmd.key
        const field = key ? getField(fields, key) : undefined
        debug('command message', cmd.action, field)
        chrome.runtime.sendMessage(
          { action: cmd.action, payload: field })
          .catch(console.error)
      })()
    }
    else {
      debug('cancel command')
      chrome.runtime?.sendMessage({ action: 'cancel-pickers', isOptional: true })
        .catch(console.error)
    }
  })
  // receive
  const handlers: Record<string, (payload: any) => void> = {
    setField: (field: Field) => {
      debug('set field', field)
      fields.update(fields => updateField(fields, field.name, field))
      activeCommand.set(null)
    },
    setFields: (newFields: Field[]) => {
      debug('set fields', newFields)
      fields.update(fields => updateFields(fields, newFields))
      activeCommand.set(null)
    },
    takeScreenshot: async ({ field, area }: { field: Field; area: Area }) => {
      debug('Taking screenshot...', area)
      const dataUrl = await chrome.tabs.captureVisibleTab()
      const url = await cropImage(dataUrl, area)
      debug('set screenshot', field)
      fields.update(fields => updateField(fields, field.name, { value: url }))
      activeCommand.set(null)
    },
    cancel: (field: Field) => {
      debug('cancel', field)
      activeCommand.set(null)
    },
  }
  const onMessage = (message: any) => {
    if (message.action in handlers) handlers[message.action](message.payload)
  }
  chrome.runtime?.onMessage.removeListener(onMessage)
  chrome.runtime?.onMessage.addListener(onMessage)
})
