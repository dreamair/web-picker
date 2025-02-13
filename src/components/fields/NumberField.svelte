<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements'
	import type { Writable } from 'svelte/store'
	import { copyToClipboard } from '../../common/clipboard.js'
	import { debug } from '../../common/debug.js'
	import type { Command } from '../../model/Command.js'
	import type { Field } from '../../model/Field.js'
	import { updateField } from '../../model/Field.js'
	import type { PageAction } from '../../model/Message.js'
	import FieldHeader from './FieldHeader.svelte'

	interface Props {
		key: string
		fields: Writable<Field[]>
		activeCommand: Writable<Command | null>
		isEditMode?: boolean
		actions?: PageAction[]
	}

	const {
		key,
		fields,
		activeCommand,
		isEditMode = false,
		actions,
	}: Props = $props()

	const field = $derived($fields.find(f => f.name === key))
	const value = $derived(typeof field?.value === 'number' ? field.value : '')

	const onChanged: ChangeEventHandler<HTMLInputElement> = event => {
		const str = event.currentTarget.value
		if (!str) return
		const value = parseFloat(str)
		if (isNaN(value)) return
		fields.update(fields => updateField(fields, key, { value }))
		debug('Number changed:', key)
	}

	const onCopy = () => {
		copyToClipboard(String(value))
	}
</script>

<article class:picking={$activeCommand?.key === key}>
	<FieldHeader
		{key}
		{fields}
		{activeCommand}
		{isEditMode}
		{actions}
		pickTitle="Pick or select a number on the current Web page.">
		{#if value !== ''}
			<button
				onclick={onCopy}
				class="outline"
				title="Copy this field to the clipboard.">📋</button>
		{/if}
	</FieldHeader>
	{#if !field}
		<div>Field not found!</div>
	{:else}
		<input type="number" {value} oninput={onChanged} disabled={isEditMode} />
	{/if}
</article>

<style>
	article {
		margin: 0 0 8px;
	}
	input {
		margin: 0;
		text-align: right;
	}
	.picking > input {
		--pico-border-color: var(--pico-form-element-focus-color);
	}
</style>
