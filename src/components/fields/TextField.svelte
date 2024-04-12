<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements'
	import type { Writable } from 'svelte/store'
	import type { Command, Field } from '../../common/data'
	import { removeField, toggleCommand, updateField } from '../../common/data.js'
	import { autoHeight } from '../autoHeight.js'

	export let key: string
	export let data: Writable<Field[]>
	export let activeCommand: Writable<Command | null>
	export let isEditMode = false

	let isKeyValid = true

	$: field = $data.find(f => f.name === key)
	$: text = field?.value ?? ''

	const prefixes = {
		url: /^([\w:/.-]+)\?/,
		string: /([^|-]+)[|-]/,
	}

	$: prefix = prefixes[field?.type as keyof typeof prefixes]
	$: hasPrefix = prefix && prefix.test(text)

	const postfixes = {
		string: /[|-](.*)/,
	}

	$: postfix = postfixes[field?.type as keyof typeof postfixes]
	$: hasPostfix = postfix && postfix.test(text)

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
	const onTextChanged: ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = ({ currentTarget }) => {
		updateData(currentTarget.value)
		console.log('Text changed:', key)
	}
	const onPick = () => {
		activeCommand.update(toggleCommand({ key, action: 'pick' }))
		console.log('Picked:', key)
	}
	const onPrefix = () => {
		updateData(text.match(prefix)?.[1].trim())
	}
	const onPostfix = () => {
		updateData(text.match(postfix)?.[1].trim())
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
			{#if hasPrefix}
				<button
					on:click={onPrefix}
					class="outline"
					title="Keep only the prefix.">↤</button>
			{/if}
			{#if hasPostfix}
				<button
					on:click={onPostfix}
					class="outline"
					title="Keep only the postfix.">↦</button>
			{/if}
			<button
				on:click={onPick}
				class="outline"
				title="Pick or select a text on the current Web page.">📌</button>
		{/if}
	</header>
	{#if !field}
		<div>Field not found!</div>
	{:else if field.type === 'text'}
		<textarea value={text} on:input={onTextChanged} use:autoHeight />
	{:else}
		<input
			type="text"
			value={text}
			on:input={onTextChanged}
			disabled={isEditMode} />
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
	input,
	textarea {
		margin: 0;
	}
	textarea {
		max-height: 200px;
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
	.picking > input,
	.picking > textarea {
		--pico-border-color: var(--pico-form-element-focus-color);
	}
</style>
