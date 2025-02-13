<script lang="ts">
	import { copyToClipboard } from '../common/clipboard.js'
	import type { FieldType } from '../model/Field.js'
	import type { Message, PageAction } from '../model/Message.js'
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

	// #region edit mode
	let isEditMode = $state(false)

	const toggleEditMode = () => {
		isEditMode = !isEditMode
	}
	// #endregion

	// #region state
	let key = $state('')
	$effect(() => {
		key = $currentSchemaKey
	})
	$effect(() => {
		if (key === newSchemaKey) {
			setTimeout(() => {
				const newKey = prompt('Enter the name of the new schema:', 'new schema')
				addSchema(newKey)
			}, 0)
		} else {
			currentSchemaKey.set(key)
		}
	})
	// #endregion

	let pageActions = $state<PageAction[]>([])
	const allFieldActions = $derived(pageActions.filter(a => !a.singleField))
	const singleFieldActions = $derived(pageActions.filter(a => a.singleField))
	chrome.runtime.onMessage.addListener(
		async ({ action, payload }: Message, sender) => {
			if (action !== 'offer-actions') return
			console.log('offer actions message', action, payload, sender)
			pageActions = payload
		},
	)

	// #region actions
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

	const onRemove = () => {
		if (!confirm(`Are you sure you want to remove this schema '${key}'?`))
			return
		removeSchema(key)
	}
	// #endregion
</script>

<div class="root">
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
		<button onclick={toggleEditMode} class="outline">✏️</button>
	</header>
	<main>
		{#each $activeFields as field}
			{@const SvelteComponent = fieldComponents[field.type]}
			<SvelteComponent
				key={field.name}
				{fields}
				{activeCommand}
				{isEditMode}
				actions={singleFieldActions} />
		{/each}
	</main>
	<footer>
		{#if isEditMode}
			<div></div>
			<div>
				<button class="text-icon" onclick={onAdd} title="Add a new field."
					>+</button>
				{#if key !== 'default'}
					<button
						onclick={onRemove}
						title="Delete all fields and remove this schema.">❌</button>
				{/if}
			</div>
		{:else}
			<div>
				<div>
					<button
						class="copy"
						onclick={onCopyJson}
						title="Copy the data in JSON format to the clipboard.">
						JSON
					</button>
					<button
						class="copy"
						onclick={onCopyCsv}
						title="Copy the data in CSV format to the clipboard.">
						CSV
					</button>
					<button
						class="copy"
						onclick={onCopyMd}
						title="Copy the data in Markdown format to the clipboard.">
						MD
					</button>
				</div>
				<div>
					<button
						class="secondary"
						onclick={onPageData}
						title="Automatically try to extract page data like URL, title,..."
						>✨</button>
					<button class="secondary" onclick={onClear} title="Clear all data."
						>🧹</button>
				</div>
			</div>
			<div>
				<div class="page-actions">
					{#each allFieldActions as action}
						<button
							onclick={() =>
								chrome.runtime.sendMessage({
									action: 'execute-action',
									payload: { action: action.type, fields: $fields },
								})}
							title={action.description}>
							{action.label}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</footer>
</div>

<style>
	.root {
		display: flex;
		flex-direction: column;
		max-height: 100vh;
	}
	header {
		display: flex;
		align-items: center;
		padding: var(--pico-spacing);
		gap: 8px;
	}
	main {
		overflow: auto;
	}
	select {
		margin: 0;
		color: var(--pico-secondary);
	}
	select.edit-mode {
		color: var(--pico-primary);
	}
	footer > div {
		display: flex;
		justify-content: space-between;
	}
	footer > div > div {
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
	.page-actions button {
		font-size: 1em;
		font-weight: normal;
	}
</style>
