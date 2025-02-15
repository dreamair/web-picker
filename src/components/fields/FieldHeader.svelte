<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements'
	import type { Writable } from 'svelte/store'
	import { debug } from '../../common/debug.js'
	import type { Command } from '../../model/Command.js'
	import { toggleCommand } from '../../model/Command.js'
	import { type Field } from '../../model/Field.js'
	import type { PageAction } from '../../model/Message.js'
	import {
		moveFieldInCurrentSchema,
		removeFieldInCurrentSchema,
		renameFieldInCurrentSchema,
	} from '../../state/schemas.js'

	interface Props {
		key: string
		fields: Writable<Field[]>
		activeCommand: Writable<Command | null>
		isEditMode?: boolean
		pickTitle?: string | null
		children?: import('svelte').Snippet
		actions?: PageAction[]
	}

	const {
		key,
		fields,
		activeCommand,
		isEditMode = false,
		pickTitle = null,
		children,
		actions = [],
	}: Props = $props()

	let isKeyValid = $state(true)

	const onKeyChanged: ChangeEventHandler<HTMLInputElement> = event => {
		const newKey = event.currentTarget.value
		if (newKey === key) return
		isKeyValid = !$fields.find(f => f.name === newKey)
		debug('Key changed:', key)
		renameFieldInCurrentSchema(key, newKey)
	}
	const onAction = (action: PageAction) => {
		chrome.runtime.sendMessage({
			action: 'execute-action',
			payload: { key, action: action.type, fields: $fields },
		})
	}
	const onPick = () => {
		activeCommand.update(toggleCommand({ key, action: 'pick' }))
		debug('Picked:', key)
	}
	const onMoveUp = () => {
		moveFieldInCurrentSchema(key, -1)
	}
	const onRemove = () => {
		removeFieldInCurrentSchema(key)
		debug('Removed:', key)
	}
</script>

<header class:picking={$activeCommand?.key === key}>
	{#if isEditMode}
		<input
			type="text"
			value={key}
			oninput={onKeyChanged}
			aria-label="Field key"
			aria-invalid={isKeyValid ? undefined : true} />
		<button onclick={onMoveUp} class="outline" title="Move up">⋀</button>
		<button onclick={onRemove} class="outline" title="Remove this field."
			>❌</button>
	{:else}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div onclick={onPick}>{key}</div>
		{#each actions as action}
			<button
				class="outline"
				onclick={() => {
					onAction(action)
				}}
				title={action.description}>{action.label}</button>
		{/each}
		{#if actions.length}
			<div class="separator"></div>
		{/if}
		{@render children?.()}
		<button onclick={onPick} class="outline" title={pickTitle}>📌</button>
	{/if}
</header>

<style>
	header {
		display: flex;
		align-items: center;
	}
	input {
		margin: 0;
		--pico-line-height: 1;
	}
	div {
		font-size: 1rem;
		flex: auto;
		padding: var(--pico-form-element-spacing-vertical)
			var(--pico-form-element-spacing-horizontal);
		opacity: 0.5;
	}
	button {
		font-weight: bold;
	}
	.picking {
		background-color: var(--pico-secondary-background);
	}
	.picking div {
		opacity: 1;
	}
	.separator {
		width: 1em;
		flex: none;
	}
</style>
