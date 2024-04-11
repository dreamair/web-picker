import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from '../package.json'

const { version, name, description } = packageJson

export default defineManifest(async (env) => ({
	manifest_version: 3,
	name, description, version,
	icons: {
		'16': 'src/assets/icons/icon-16.png',
		'32': 'src/assets/icons/icon-32.png',
		'48': 'src/assets/icons/icon-48.png',
		'128': 'src/assets/icons/icon-128.png',
	},
	content_scripts: [
		{
			matches: ['<all_urls>'],
			js: ['src/content/index.ts'],
		},
	],
	background: {
		service_worker: 'src/background/index.ts',
	},
	options_ui: {
		page: 'src/options/options.html',
		open_in_tab: false,
	},
	side_panel: {
		default_path: 'src/sidepanel/sidepanel.html',
	},
	action: {
		default_popup: 'src/popup/popup.html',
		default_icon: {
			'16': 'src/assets/icons/icon-16.png',
			'32': 'src/assets/icons/icon-32.png',
			'48': 'src/assets/icons/icon-48.png',
			'128': 'src/assets/icons/icon-128.png',
		},
	},
	permissions: ['storage', 'sidePanel', 'activeTab'],
	host_permissions: ['<all_urls>'],
}))
