<script lang="ts">
	import type { FieldType } from '../model/Field.js'
	import { addField } from '../model/Schema.js'
	import { exportCsv, exportJson, exportMd } from '../service/export.js'
	import { activeCommand } from '../state/command.js'
	import { activeFields, fields } from '../state/fields.js'
	import { currentSchema, currentSchemaKey, schemas } from '../state/schemas.js'
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
				addField(schemas, $currentSchemaKey, { name, type }),
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
</script>

<div>
	<header>
		{#if $schemas}
			<select
				name="select"
				aria-label="Select"
				required
				bind:value={$currentSchemaKey}
				class:edit-mode={isEditMode}>
				{#each Object.keys($schemas) as key}
					<option value={key}>{key}</option>
				{/each}
				<option value="--new--">new schema</option>
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
			<div>
				<button on:click={onAdd} title="Add a new field.">+</button>
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
</style>
