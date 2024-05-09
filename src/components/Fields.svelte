<script lang="ts">
	import {
		activeCommand,
		data,
		exportCsv,
		exportJson,
		exportMd,
		fieldLists,
	} from '../common/data.js'
	import { fieldComponents } from './fields/index.js'

	let fieldSetKey: keyof typeof fieldLists = 'default'

	$: data.update(fields =>
		fieldLists[fieldSetKey].map(field => {
			const f = fields.find(f => f.name === field.name)
			return f ? { ...f, ...field } : field
		}),
	)

	let isEditMode = false

	const toggleEditMode = () => {
		isEditMode = !isEditMode
	}

	const onAdd = () => {
		alert('TODO: Add a new field.')
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
		data.subscribe(d => copyToClipboard(exportJson(d)))()
	}

	const onCopyCsv = () => {
		data.subscribe(d => copyToClipboard(exportCsv(d)))()
	}

	const onCopyMd = () => {
		data.subscribe(d => copyToClipboard(exportMd(d)))()
	}

	const onClear = () => {
		data.update(fields => fields.map(f => ({ name: f.name, type: f.type })))
	}
</script>

<div>
	<header>
		<select
			name="select"
			aria-label="Select"
			required
			bind:value={fieldSetKey}
			class:edit-mode={isEditMode}>
			<option value="default">General Web Page</option>
			<option value="product">Product Page</option>
			<option>TODO: Document,...</option>
			<option>TODO: new field set...</option>
		</select>
		<button on:click={toggleEditMode} class="outline">✏️</button>
	</header>
	{#each $data as field}
		<svelte:component
			this={fieldComponents[field.type]}
			key={field.name}
			{data}
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
