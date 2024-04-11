<script lang="ts">
	import type { FieldValue } from '../common/data.js'
	import { activeCommand, data } from '../common/data.js'
	import { fieldComponents } from './fields/index.js'

	const fieldSets = {
		default: {
			url: { type: 'url' },
			title: { type: 'string' },
			description: { type: 'text' },
			image: { type: 'image' },
		},
		product: {
			url: { type: 'url' },
			title: { type: 'string' },
			description: { type: 'text' },
			image: { type: 'image' },
			price: { type: 'string' },
		},
	} satisfies Record<string, Record<string, FieldValue>>

	let fieldSetKey: keyof typeof fieldSets = 'default'

	$: data.update(f =>
		Object.entries(fieldSets[fieldSetKey]).reduce(
			(acc, [key, value]) => {
				acc[key] = key in f ? { ...value, ...f[key] } : value
				return acc
			},
			{} as Record<string, FieldValue>,
		),
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

	const onCopy = () => {
		data.subscribe(async d => {
			try {
				navigator.clipboard.writeText(JSON.stringify(d, null, 2))
				console.log('Data copied to clipboard')
			} catch (err) {
				console.error('Failed to copy data: ', err)
			}
		})
	}

	const onClear = () => {
		data.update(d =>
			Object.entries(d).reduce(
				(acc, [key, value]) => {
					acc[key] = { type: value.type }
					return acc
				},
				{} as Record<string, FieldValue>,
			),
		)
	}
</script>

<div>
	<header>
		<select name="select" aria-label="Select" required bind:value={fieldSetKey}>
			<option value="default">General Web Page</option>
			<option value="product">Product Page</option>
			<option>TODO: Document,...</option>
			<option>TODO: new field set...</option>
		</select>
		<button on:click={toggleEditMode} class="outline">✏️</button>
	</header>
	{#each Object.entries($data) as [key, field]}
		<svelte:component
			this={fieldComponents[field.type]}
			{key}
			{data}
			{activeCommand}
			{isEditMode} />
	{/each}
	<footer>
		{#if isEditMode}
			<button on:click={onAdd} title="Add a new field.">+</button>
		{:else}
			<button
				on:click={onPageData}
				title="Automatically try to extract page data like URL, title,..."
				>✨</button>
			<button on:click={onCopy} title="Copy the data to the clipboard."
				>📋</button>
			<button on:click={onClear} title="Clear all data.">🧹</button>
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
	}
	footer {
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
</style>
