<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements'
	import type { Writable } from 'svelte/store'
	import type { Command, Field } from '../../common/data'
	import { updateField } from '../../common/data.js'
	import FieldHeader from './FieldHeader.svelte'

	export let key: string
	export let data: Writable<Field[]>
	export let activeCommand: Writable<Command | null>
	export let isEditMode = false

	$: field = $data.find(f => f.name === key)
	$: value = typeof field?.value === 'number' ? field.value : -1

	const updateData = (value?: string) => {
		if (!value) return
		data.update(fields => updateField(fields, key, { value }))
	}

	const onChanged: ChangeEventHandler<HTMLInputElement> = event => {
		updateData(event.currentTarget.value)
		console.log('Number changed:', key)
	}
</script>

<article class:picking={$activeCommand?.key === key}>
	<FieldHeader
		{key}
		{data}
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
