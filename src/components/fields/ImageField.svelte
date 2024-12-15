<script lang="ts">
	import type { Writable } from 'svelte/store'
	import placeholder from '../../assets/placeholder.svg'
	import { copyImageToClipboard } from '../../common/clipboard.js'
	import type { Command } from '../../model/Command.js'
	import { toggleCommand } from '../../model/Command.js'
	import { getField, type Field, type ImageField } from '../../model/Field.js'
	import FieldHeader from './FieldHeader.svelte'

	interface Props {
		key: string
		fields: Writable<Field[]>
		activeCommand: Writable<Command | null>
		isEditMode?: boolean
	}

	const { key, fields, activeCommand, isEditMode = false }: Props = $props()

	const field = $derived($fields.find(f => f.name === key) as ImageField | null)

	const onScreenshot = () => {
		activeCommand.update(toggleCommand({ key, action: 'pick-screenshot' }))
		console.log('Picked:', key)
	}

	const onCopy = () => {
		if (field?.value) {
			const title = getField($fields, 'title')?.value as string | undefined
			copyImageToClipboard(
				field.value,
				title ? title : field.name === 'image' ? '' : field.name,
			).catch(err => {
				alert(`Failed to copy the image to the clipboard: ${err}`)
			})
		}
	}
</script>

<article>
	<FieldHeader
		{key}
		{fields}
		{activeCommand}
		{isEditMode}
		pickTitle="Pick an image on the current Web page.">
		{#if field?.value}
			<button
				onclick={onCopy}
				class="outline"
				title="Copy this field to the clipboard.">📋</button>
		{/if}
		<button onclick={onScreenshot} class="outline">✂️</button>
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
