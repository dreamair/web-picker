<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements'
	import type { Writable } from 'svelte/store'
	import type { Command, FieldValue, ImageValue } from '../../common/data.js'
	import { toggleCommand } from '../../common/data.js'

	export let key: string
	export let data: Writable<Record<string, FieldValue>>
	export let activeCommand: Writable<Command | null>
	export let isEditMode = false

	let isKeyValid = true

	$: value = $data[key] as ImageValue

	const onKeyChanged: ChangeEventHandler<HTMLInputElement> = event => {
		const newKey = event.currentTarget.value
		if (newKey === key) return
		isKeyValid = !(newKey in $data)
		console.log('Key changed:', key)
	}
	const onPick = () => {
		activeCommand.update(toggleCommand({ key, action: 'pick' }))
		console.log('Picked:', key)
	}
	const onScreenshot = () => {
		activeCommand.update(toggleCommand({ key, action: 'pick-screenshot' }))
		console.log('Picked:', key)
	}
	const onRemove = () => {
		data.update(d => {
			const { [key]: _, ...rest } = d
			return rest
		})
		console.log('Removed:', key)
	}
</script>

<article class:picking={$activeCommand?.key === key}>
	<header>
		{#if isEditMode}
			<input
				type="text"
				value={key}
				on:change={onKeyChanged}
				aria-label="Field key"
				aria-invalid={isKeyValid ? undefined : true} />
			<button on:click={onRemove} class="outline" title="Remove this field."
				>❌</button>
		{:else}
			<div>{key}</div>
			<button on:click={onScreenshot} class="outline">✂️</button>
			<button on:click={onPick} class="outline">📌</button>
		{/if}
	</header>
	<img
		src={value.url ? value.url : '/src/assets/placeholder.svg'}
		alt="picked" />
</article>

<style>
	article {
		margin: 0 0 8px;
	}
	header {
		display: flex;
		align-items: center;
	}
	input {
		margin: 0;
	}
	header input {
		opacity: 0.5;
		--pico-line-height: 1;
	}
	header div {
		font-size: 1rem;
		flex: auto;
		padding: var(--pico-form-element-spacing-vertical)
			var(--pico-form-element-spacing-horizontal);
		opacity: 0.5;
	}
	img {
		max-width: 100%;
		max-height: 100%;
		margin: 0 auto;
		display: block;
	}
	.picking header div {
		opacity: 1;
	}
	.picking header input {
		opacity: 1;
	}
</style>
