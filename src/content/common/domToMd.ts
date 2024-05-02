const tagHandlers = {
	['#text']: (n: Node) => n.textContent?.replace(/\s+/g, ' ') ?? '',
	['BR']: () => '\n',
	['P']: (n: HTMLParagraphElement) => `\n\n${childNodesToMd(n)}\n\n`,
	['DIV']: (n: HTMLDivElement) => `\n${childNodesToMd(n)}\n`,
	['UL']: (n: HTMLDivElement) => `\n${childNodesToMd(n)}\n`,
	['OL']: (n: HTMLDivElement) => `\n${childNodesToMd(n)}\n`,
	['LI']: (n: HTMLDivElement) => `${n.parentElement?.nodeName === 'OL'
		? `${childIndex(n) + 1}.` : '-'} ${childNodesToMd(n)}\n`,
	['B']: (n: HTMLElement) => `**${childNodesToMd(n)}**`,
	['STRONG']: (n: HTMLElement) => `**${childNodesToMd(n)}**`,
	['I']: (n: HTMLElement) => `*${childNodesToMd(n)}*`,
	['EM']: (n: HTMLElement) => `*${childNodesToMd(n)}*`,
	['A']: (n: HTMLAnchorElement) => `[${childNodesToMd(n)}](${n.href})`,
	['IMG']: (n: HTMLImageElement) => `![${n.alt}](${n.src})`,
	['CODE']: (n: HTMLElement) => `\`${childNodesToMd(n)}\``,
	['PRE']: (n: HTMLPreElement) =>
		`\n\`\`\`\n${n.textContent?.trim() ?? ''}\n\`\`\`\n`,
} as unknown as { [nodeName: string]: (n: Node) => string }
function childIndex(n: HTMLElement) {
	return Array.prototype.indexOf.call(n.parentNode?.children, n)
}
function nodeToMd(node?: Node | null) {
	return node
		? node.nodeName in tagHandlers
			? tagHandlers[node.nodeName](node)
			: childNodesToMd(node)
		: ''
}
function nodesToMd(nodes: Node[]) {
	let md = ''
	nodes.forEach(n => {
		const t = nodeToMd(n)
		const t0 = t[0]
		const mdLast = md.at(-1)
		if (t0 === '\n' && mdLast === ' ')
			md = md.substring(0, md.length - 1)
		md += (t0 === '\n' || t0 === ' ') && mdLast === '\n' ? t.substring(1) : t
	})
	return md
}
function childNodesToMd(node?: Node | null) {
	return node ? nodesToMd([...node.childNodes]) : ''
}

export function domToMd(node?: Node | null) {
	return nodeToMd(node).replace(/\n{2,}/gm, '\n\n').trim()
}

export function htmlToMd(html?: string | null) {
	const div = document.createElement('div')
	div.innerHTML = html ?? ''
	console.log(div, html, div.innerHTML)
	return domToMd(div)
}
