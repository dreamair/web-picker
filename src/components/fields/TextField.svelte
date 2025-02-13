<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements'
	import type { Writable } from 'svelte/store'
	import { autoHeight } from '../../common/autoHeight.js'
	import { copyToClipboard } from '../../common/clipboard.js'
	import type { Command } from '../../model/Command.js'
	import type { Field } from '../../model/Field.js'
	import { getField, updateField } from '../../model/Field.js'
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
		actions = [],
	}: Props = $props()

	// #region state
	const field = $derived($fields.find(f => f.name === key))
	const text = $derived(
		typeof field?.value === 'number' ? `${field.value}` : (field?.value ?? ''),
	)
	const typeLabel = $derived(
		field?.type === 'string' ? 'text' : (field?.type ?? 'text'),
	)

	const prefixes = {
		url: /^.+?[^\w:;.,/\-=~[\]()&$!@*+]+/,
		string: /^.+?\W+/,
	}
	const prefixes1 = {
		string: /^.+?[^\w .,]+/,
	}

	const prefix = $derived(prefixes[field?.type as keyof typeof prefixes])
	const hasPrefix = $derived(prefix && prefix.test(text))

	const postfixes = {
		url: /[^\w:;.,/\-=~[\]()&$!@*+]+.*/,
		string: /\W+\w*$/,
	}
	const postfixes1 = {
		string: /[^\w .,]+[\w .,]*$/,
	}

	const postfix = $derived(postfixes[field?.type as keyof typeof postfixes])
	const hasPostfix = $derived(postfix && postfix.test(text))

	const mds = [
		/!?\[([^\]\n]*)\]\(\S+\)/gm,
		/\*\*([^*\n]+)\*\*/gm,
		/\*([^*\n]+)\*/gm,
		/```([^`]+)```/gm,
		/`([^`\n]+)`/gm,
	]
	const plain = $derived(
		mds.reduce((t, pattern) => t.replaceAll(pattern, '$1'), text),
	)
	const hasMd = $derived(plain !== text)
	// #endregion

	// #region actions
	const updateData = (value?: string) => {
		if (!value) return
		fields.update(fields => updateField(fields, key, { value }))
	}

	const onTextChanged: ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = ({ currentTarget }) => {
		updateData(currentTarget.value)
	}
	const onPrefix = () => {
		const prefix1 = prefixes1[field?.type as keyof typeof prefixes1]
		const p = prefix1?.test(text) ? prefix1 : prefix
		updateData(text.replace(p, '').trim())
	}
	const onPostfix = () => {
		const postfix1 = postfixes1[field?.type as keyof typeof postfixes1]
		const p = postfix1?.test(text) ? postfix1 : postfix
		updateData(text.replace(p, '').trim())
	}
	const onMd = () => {
		updateData(plain)
	}
	const onCopy = () => {
		if (!text) return
		if (field?.type === 'url') {
			const title = getField($fields, 'title')?.value ?? ''
			copyToClipboard(`[${title}](${text})`)
		} else {
			copyToClipboard(text)
		}
	}
	// #endregion
</script>

<article class:picking={$activeCommand?.key === key}>
	<FieldHeader
		{key}
		{fields}
		{activeCommand}
		{isEditMode}
		{actions}
		pickTitle={`Pick or select some ${typeLabel} on the current Web page!`}>
		{#if hasPrefix}
			<button onclick={onPrefix} class="outline" title="Remove the prefix."
				>↤</button>
		{/if}
		{#if hasPostfix}
			<button onclick={onPostfix} class="outline" title="Remove the postfix."
				>↦</button>
		{/if}
		{#if hasMd}
			<button onclick={onMd} class="outline" title="Remove Markdown syntax."
				>[-]</button>
		{/if}
		{#if text}
			<button
				onclick={onCopy}
				class="outline"
				title="Copy this field to the clipboard.">📋</button>
		{/if}
	</FieldHeader>
	{#if !field}
		<div>Field not found!</div>
	{:else if field.type === 'text'}
		<textarea
			value={text}
			oninput={onTextChanged}
			use:autoHeight
			disabled={isEditMode}></textarea>
	{:else}
		<input
			type="text"
			value={text}
			oninput={onTextChanged}
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
