<script lang="ts">
	import { onMount } from 'svelte'
	import Fields from '../components/Fields.svelte'

	onMount(() => {
		chrome.runtime.sendMessage({ action: 'activate-sidepanel', payload: true })
	})
	const onActivate = (active: boolean) => {
		chrome.runtime.sendMessage({
			action: 'activate-sidepanel',
			payload: active,
			isOptional: true,
		})
	}
</script>

<svelte:window onunload={() => onActivate(false)} />
<svelte:document
	onvisibilitychangecapture={() => onActivate(!document.hidden)} />

<Fields />
