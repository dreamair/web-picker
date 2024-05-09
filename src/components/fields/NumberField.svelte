<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements'
	import type { Writable } from 'svelte/store'
	import type { Command, Field } from '../../common/data'
	import { removeField, toggleCommand, updateField } from '../../common/data.js'

	export let key: string
	export let data: Writable<Field[]>
	export let activeCommand: Writable<Command | null>
	export let isEditMode = false

	let isKeyValid = true

	$: field = $data.find(f => f.name === key)
	$: value = typeof field?.value === 'number' ? field.value : -1

	const updateData = (value?: string) => {
		if (!value) return
		data.update(fields => updateField(fields, key, { value }))
	}

	const onKeyChanged: ChangeEventHandler<HTMLInputElement> = event => {
		const newKey = event.currentTarget.value
		if (newKey === key) return
		isKeyValid = !$data.find(f => f.name === newKey)
		console.log('Key changed:', key)
	}
	const onChanged: ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = ({ currentTarget }) => {
		updateData(currentTarget.value)
		console.log('Number changed:', key)
	}
	const onPick = () => {
		activeCommand.update(toggleCommand({ key, action: 'pick' }))
		console.log('Picked:', key)
	}
	const onRemove = () => {
		data.update(fields => removeField(fields, key))
		console.log('Removed:', key)
	}
</script>

<article class:picking={$activeCommand?.key === key}>
	<header>
		{#if isEditMode}
			<input
				type="text"
				value={key}
				on:input={onKeyChanged}
				aria-label="Field key"
				aria-invalid={isKeyValid ? undefined : true} />
			<button on:click={onRemove} class="outline" title="Remove this field."
				>❌</button>
		{:else}
			<div>{key}</div>
			<button
				on:click={onPick}
				class="outline"
				title="Pick or select a number on the current Web page.">📌</button>
		{/if}
	</header>
	{#if !field}
		<div>Field not found!</div>
	{:else}
		<input type="number" {value} on:input={onChanged} disabled={isEditMode} />
	{/if}
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
		--pico-line-height: 1;
	}
	header div {
		font-size: 1rem;
		flex: auto;
		padding: var(--pico-form-element-spacing-vertical)
			var(--pico-form-element-spacing-horizontal);
		opacity: 0.5;
	}
	button {
		font-weight: bold;
	}
	.picking header div {
		opacity: 1;
	}
	.picking > input {
		--pico-border-color: var(--pico-form-element-focus-color);
	}
</style>
