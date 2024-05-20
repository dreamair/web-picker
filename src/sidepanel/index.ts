import { setup } from '../common/setup.js'
import '../service/messages.js'
import { fillPageData } from '../service/pageData.js'
import '../service/schemas.js'
import { fields } from '../state/fields.js'
import SidePanel from './SidePanel.svelte'

// Side panel
// https://developer.chrome.com/docs/extensions/reference/sidePanel/

function render() {
	const target = document.getElementById('app')
	if (!target) return
	new SidePanel({ target })
	setup()
	fillPageData(fields)
}

document.addEventListener('DOMContentLoaded', render)
