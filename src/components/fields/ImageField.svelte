<script lang="ts">
	import type { Writable } from 'svelte/store'
	import type { Command, Field, ImageField } from '../../common/data.js'
	import { toggleCommand } from '../../common/data.js'
	import FieldHeader from './FieldHeader.svelte'

	export let key: string
	export let data: Writable<Field[]>
	export let activeCommand: Writable<Command | null>
	export let isEditMode = false

	$: field = $data.find(f => f.name === key) as ImageField | null

	const onScreenshot = () => {
		activeCommand.update(toggleCommand({ key, action: 'pick-screenshot' }))
		console.log('Picked:', key)
	}
</script>

<article>
	<FieldHeader
		{key}
		{data}
		{activeCommand}
		{isEditMode}
		pickTitle="Pick an image on the current Web page.">
		<button on:click={onScreenshot} class="outline">✂️</button>
	</FieldHeader>
	<img
		src={field?.value ? field.value : '/src/assets/placeholder.svg'}
		alt="picked"
		class:disabled={isEditMode} />
</article>

<style>
	article {
		margin: 0 0 8px;
	}
	img {
		max-width: 100%;
		max-height: 100%;
		margin: 0 auto;
		display: block;
	}
	.disabled {
		opacity: 0.3;
	}
</style>
