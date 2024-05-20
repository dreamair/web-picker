export function autoHeight(node: HTMLElement) {
	const borderWidth = parseInt(getComputedStyle(node).borderWidth)
	const resize = () => {
		node.style.height = 'auto'
		node.style.height = `${node.scrollHeight + 2 * borderWidth}px`
	}
	const elementPrototype = Object.getPrototypeOf(node)
	const descriptor = Object.getOwnPropertyDescriptor(elementPrototype, 'value')
	if (descriptor) {
		Object.defineProperty(node, 'value', {
			get() { return descriptor.get?.apply(this) },
			set(value: string) {
				descriptor.set?.apply(this, [value])
				resize()
			},
		})
	}
}