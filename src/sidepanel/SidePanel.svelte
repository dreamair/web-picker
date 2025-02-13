<script lang="ts">
	import { onMount } from 'svelte'
	import Fields from '../components/Fields.svelte'

	onMount(() => {
		chrome.runtime.sendMessage({ action: 'activate-sidepanel', payload: true })
	})
	const onClose = () => {
		if (document.hidden)
			chrome.runtime.sendMessage({
				action: 'activate-sidepanel',
				payload: false,
			})
	}
</script>

<svelte:window onunload={onClose} />
<svelte:document onvisibilitychangecapture={onClose} />

<Fields />
