import { onSetup } from '../common/setup.js'
import { defaultSchemas, newSchemaKey } from '../model/Schema.js'
import { currentSchemaKey as schemaKey, schemas } from '../state/schemas.js'

onSetup(() => {

  if (!chrome.storage) return

  chrome.storage.sync.get('schemas')
    .then(({ schemas: data }) => {
      schemas.set(data || defaultSchemas)
    })

  schemas.subscribe(schemas => {
    chrome.storage.sync.set({ schemas })
  })

  chrome.storage.sync.get('schemaKey')
    .then(({ schemaKey: data }) => {
      if (data) schemaKey.set(data)
    })

  schemaKey.subscribe(schemaKey => {
    if (!schemaKey || schemaKey === newSchemaKey) return
    chrome.storage.sync.set({ schemaKey })
  })

})
