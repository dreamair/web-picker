<script lang="ts">
	import type { FieldType } from '../model/Field.js'
	import { addSchemaField, newSchemaKey } from '../model/Schema.js'
	import { exportCsv, exportJson, exportMd } from '../service/export.js'
	import { activeCommand } from '../state/command.js'
	import { activeFields, fields } from '../state/fields.js'
	import {
		addSchema,
		currentSchema,
		currentSchemaKey,
		removeSchema,
		schemas,
	} from '../state/schemas.js'
	import { fieldComponents } from './fields/index.js'

	let isEditMode = false

	const toggleEditMode = () => {
		isEditMode = !isEditMode
	}

	const onAdd = () => {
		const name = prompt('Enter the name of the new field:', 'new field')
		const type = prompt(
			'Enter the type of the new field:',
			'string',
		) as FieldType
		if (name && type) {
			schemas.update(schemas =>
				addSchemaField(schemas, $currentSchemaKey, { name, type }),
			)
		}
	}

	const onPageData = () => {
		activeCommand.set({ action: 'pick-pageData' })
	}

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			console.log('Data copied to clipboard')
		} catch (err) {
			console.error('Failed to copy data: ', err)
		}
	}

	const onCopyJson = () => {
		activeFields.subscribe(d => copyToClipboard(exportJson(d)))()
	}

	const onCopyCsv = () => {
		activeFields.subscribe(d => copyToClipboard(exportCsv(d)))()
	}

	const onCopyMd = () => {
		activeFields.subscribe(d => copyToClipboard(exportMd(d)))()
	}

	const onClear = () => {
		fields.set($currentSchema.map(f => ({ ...f })))
	}

	$: key = $currentSchemaKey
	$: if (key === newSchemaKey) {
		setTimeout(() => {
			const newKey = prompt('Enter the name of the new schema:', 'new schema')
			addSchema(newKey)
		}, 0)
	} else {
		currentSchemaKey.set(key)
	}
	const onRemove = () => {
		if (!confirm(`Are you sure you want to remove this schema '${key}'?`))
			return
		removeSchema(key)
	}
</script>

<div>
	<header>
		{#if $schemas}
			<select
				name="select"
				aria-label="Select"
				required
				bind:value={key}
				class:edit-mode={isEditMode}>
				{#each Object.keys($schemas) as key}
					<option value={key}>{key}</option>
				{/each}
				{#if isEditMode}
					<option value={newSchemaKey} title="add a new schema..."
						>+ ...</option>
				{/if}
			</select>
		{/if}
		<button on:click={toggleEditMode} class="outline">✏️</button>
	</header>
	{#each $activeFields as field}
		<svelte:component
			this={fieldComponents[field.type]}
			key={field.name}
			{fields}
			{activeCommand}
			{isEditMode} />
	{/each}
	<footer>
		{#if isEditMode}
			<div></div>
			<div>
				<button class="text-icon" on:click={onAdd} title="Add a new field."
					>+</button>
				{#if key !== 'default'}
					<button
						on:click={onRemove}
						title="Delete all fields and remove this schema.">❌</button>
				{/if}
			</div>
		{:else}
			<div>
				<button
					class="copy"
					on:click={onCopyJson}
					title="Copy the data in JSON format to the clipboard.">
					JSON
				</button>
				<button
					class="copy"
					on:click={onCopyCsv}
					title="Copy the data in CSV format to the clipboard.">
					CSV
				</button>
				<button
					class="copy"
					on:click={onCopyMd}
					title="Copy the data in Markdown format to the clipboard.">
					MD
				</button>
			</div>
			<div>
				<button
					class="secondary"
					on:click={onPageData}
					title="Automatically try to extract page data like URL, title,..."
					>✨</button>
				<button class="secondary" on:click={onClear} title="Clear all data."
					>🧹</button>
			</div>
		{/if}
	</footer>
</div>

<style>
	header {
		display: flex;
		align-items: center;
		padding: var(--pico-spacing);
		gap: 8px;
	}
	select {
		margin: 0;
		color: var(--pico-secondary);
	}
	select.edit-mode {
		color: var(--pico-primary);
	}
	footer {
		display: flex;
		justify-content: space-between;
	}
	footer > div {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		padding: var(--pico-spacing);
	}
	button {
		opacity: 1;
		font-size: 1.5em;
		font-weight: bold;
	}
	button.copy {
		font-size: 1em;
		font-weight: normal;
	}
	button.text-icon {
		font-size: 2em;
		font-weight: bold;
		padding: 0 12px 4px;
	}
</style>
