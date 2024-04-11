

export function hasText(node: HTMLElement) {
	for (const n of node.childNodes) {
		if (n.nodeType === Node.TEXT_NODE) {
			const text = n.nodeValue?.trim()
			if (text) return true
		}
	}
	return false
}

export function style(node: HTMLElement,
	style: { [K in keyof CSSStyleDeclaration]?: string | number }) {
	Object.entries(style).forEach(([key, value]) => {
		node.style[key as any] =
			typeof value === 'number' ? `${value}px` : value as any
	})
}

export function createOverlay(r: DOMRect) {
	const overlay = document.createElement('div')
	style(overlay, {
		position: 'absolute',
		top: r.top + window.scrollY, left: r.left + window.scrollX,
		width: r.width, height: r.height,
		pointerEvents: 'none',
		zIndex: '999999999',
		backgroundColor: 'rgba(255, 0, 0, 0.1)',
		border: '1px solid red',
	})
	document.body.appendChild(overlay)
	return overlay
}

