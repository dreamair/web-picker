<script lang="ts">
	import type { Writable } from 'svelte/store'
	import placeholder from '../../assets/placeholder.svg'
	import type { Command } from '../../model/Command.js'
	import { toggleCommand } from '../../model/Command.js'
	import type { Field, ImageField } from '../../model/Field.js'
	import FieldHeader from './FieldHeader.svelte'

	export let key: string
	export let fields: Writable<Field[]>
	export let activeCommand: Writable<Command | null>
	export let isEditMode = false

	$: field = $fields.find(f => f.name === key) as ImageField | null

	const onScreenshot = () => {
		activeCommand.update(toggleCommand({ key, action: 'pick-screenshot' }))
		console.log('Picked:', key)
	}
</script>

<article>
	<FieldHeader
		{key}
		{fields}
		{activeCommand}
		{isEditMode}
		pickTitle="Pick an image on the current Web page.">
		<button on:click={onScreenshot} class="outline">✂️</button>
	</FieldHeader>
	<img
		src={field?.value ? field.value : placeholder}
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
