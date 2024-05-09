<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements'
	import type { Writable } from 'svelte/store'
	import type { Command, Field } from '../../common/data'
	import { updateField } from '../../common/data.js'
	import { autoHeight } from '../autoHeight.js'
	import FieldHeader from './FieldHeader.svelte'

	export let key: string
	export let data: Writable<Field[]>
	export let activeCommand: Writable<Command | null>
	export let isEditMode = false

	$: field = $data.find(f => f.name === key)
	$: text =
		typeof field?.value === 'number' ? `${field.value}` : field?.value ?? ''
	$: typeLabel = field?.type === 'string' ? 'text' : field?.type ?? 'text'

	const prefixes = {
		url: /^([\w:/.-]+)\?/,
		string: /([^|-–]+)[|-–]/,
	}

	$: prefix = prefixes[field?.type as keyof typeof prefixes]
	$: hasPrefix = prefix && prefix.test(text)

	const postfixes = {
		string: /[|-–](.*)/,
	}

	$: postfix = postfixes[field?.type as keyof typeof postfixes]
	$: hasPostfix = postfix && postfix.test(text)

	const mds = [
		/!?\[([^\]\n]*)\]\(\S+\)/gm,
		/\*\*([^*\n]+)\*\*/gm,
		/\*([^*\n]+)\*/gm,
		/```([^`]+)```/gm,
		/`([^`\n]+)`/gm,
	]
	$: plain = mds.reduce((t, pattern) => t.replaceAll(pattern, '$1'), text)
	$: hasMd = plain !== text

	const updateData = (value?: string) => {
		if (!value) return
		data.update(fields => updateField(fields, key, { value }))
	}

	const onTextChanged: ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = ({ currentTarget }) => {
		updateData(currentTarget.value)
		console.log('Text changed:', key)
	}
	const onPrefix = () => {
		updateData(text.match(postfix)?.[1].trim())
	}
	const onPostfix = () => {
		updateData(text.match(prefix)?.[1].trim())
	}
	const onMd = () => {
		updateData(plain)
	}
</script>

<article class:picking={$activeCommand?.key === key}>
	<FieldHeader
		{key}
		{data}
		{activeCommand}
		{isEditMode}
		pickTitle={`Pick or select some ${typeLabel} on the current Web page!`}>
		{#if hasPrefix}
			<button on:click={onPrefix} class="outline" title="Remove the prefix."
				>↤</button>
		{/if}
		{#if hasPostfix}
			<button on:click={onPostfix} class="outline" title="Remove the postfix."
				>↦</button>
		{/if}
		{#if hasMd}
			<button on:click={onMd} class="outline" title="Remove Markdown syntax."
				>[-]</button>
		{/if}
	</FieldHeader>
	{#if !field}
		<div>Field not found!</div>
	{:else if field.type === 'text'}
		<textarea
			value={text}
			on:input={onTextChanged}
			use:autoHeight
			disabled={isEditMode} />
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
	input,
	textarea {
		margin: 0;
	}
	textarea {
		max-height: 200px;
	}
	button {
		font-weight: bold;
	}
	.picking > input,
	.picking > textarea {
		--pico-border-color: var(--pico-form-element-focus-color);
	}
</style>
