import '@picocss/pico'
import { mount } from 'svelte'
import { setup } from '../common/setup.js'
import '../service/messages.js'
import { fillPageData } from '../service/pageData.js'
import '../service/schemas.js'
import { fields } from '../state/fields.js'
import SidePanel from './SidePanel.svelte'
import './styles.css'

// Side panel
// https://developer.chrome.com/docs/extensions/reference/sidePanel/

function render() {
  const target = document.getElementById('app')
  if (!target) return
  mount(SidePanel, { target })
  setup()
  fillPageData(fields)
}

document.addEventListener('DOMContentLoaded', render)
