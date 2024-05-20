<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements'
	import type { Writable } from 'svelte/store'
	import type { Command } from '../../model/Command.js'
	import type { Field } from '../../model/Field.js'
	import { updateField } from '../../model/Field.js'
	import FieldHeader from './FieldHeader.svelte'

	export let key: string
	export let fields: Writable<Field[]>
	export let activeCommand: Writable<Command | null>
	export let isEditMode = false

	$: field = $fields.find(f => f.name === key)
	$: value = typeof field?.value === 'number' ? field.value : ''

	const onChanged: ChangeEventHandler<HTMLInputElement> = event => {
		const str = event.currentTarget.value
		if (!str) return
		const value = parseFloat(str)
		if (isNaN(value)) return
		fields.update(fields => updateField(fields, key, { value }))
		console.log('Number changed:', key)
	}
</script>

<article class:picking={$activeCommand?.key === key}>
	<FieldHeader
		{key}
		{fields}
		{activeCommand}
		{isEditMode}
		pickTitle="Pick or select a number on the current Web page." />
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
	input {
		margin: 0;
		text-align: right;
	}
	.picking > input {
		--pico-border-color: var(--pico-form-element-focus-color);
	}
</style>
