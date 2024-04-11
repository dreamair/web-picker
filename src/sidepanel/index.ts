import { activeCommand, data } from '../common/data.js'
import { setupMessages } from '../common/messages.js'
import { fillPageData } from '../common/pageData.js'
import SidePanel from './SidePanel.svelte'

// Side panel
// https://developer.chrome.com/docs/extensions/reference/sidePanel/

function render() {
	const target = document.getElementById('app')
	if (!target) return
	new SidePanel({ target })
	setupMessages(data, activeCommand)
	fillPageData(data)
}

document.addEventListener('DOMContentLoaded', render)
