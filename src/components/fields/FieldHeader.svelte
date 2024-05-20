<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements'
	import type { Writable } from 'svelte/store'
	import type { Command } from '../../model/Command.js'
	import { toggleCommand } from '../../model/Command.js'
	import type { Field } from '../../model/Field.js'
	import { removeField } from '../../model/Schema.js'
	import { currentSchemaKey, schemas } from '../../state/schemas.js'

	export let key: string
	export let fields: Writable<Field[]>
	export let activeCommand: Writable<Command | null>
	export let isEditMode = false
	export let pickTitle: string | null = null

	let isKeyValid = true

	const onKeyChanged: ChangeEventHandler<HTMLInputElement> = event => {
		const newKey = event.currentTarget.value
		if (newKey === key) return
		isKeyValid = !$fields.find(f => f.name === newKey)
		console.log('Key changed:', key)
	}
	const onPick = () => {
		activeCommand.update(toggleCommand({ key, action: 'pick' }))
		console.log('Picked:', key)
	}
	const onRemove = () => {
		schemas.update(schemas => removeField(schemas, $currentSchemaKey, key))
		console.log('Removed:', key)
	}
</script>

<header class:picking={$activeCommand?.key === key}>
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
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click={onPick}>{key}</div>
		<slot></slot>
		<button on:click={onPick} class="outline" title={pickTitle}>📌</button>
	{/if}
</header>

<style>
	header {
		display: flex;
		align-items: center;
	}
	input {
		margin: 0;
		--pico-line-height: 1;
	}
	div {
		font-size: 1rem;
		flex: auto;
		padding: var(--pico-form-element-spacing-vertical)
			var(--pico-form-element-spacing-horizontal);
		opacity: 0.5;
	}
	button {
		font-weight: bold;
	}
	.picking {
		background-color: var(--pico-secondary-background);
	}
	.picking div {
		opacity: 1;
	}
</style>
