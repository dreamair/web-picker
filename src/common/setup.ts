
const setupHandlers: (() => void)[] = []

export function onSetup(handler: () => void) {
	setupHandlers.push(handler)
}

export function setup() {
	setupHandlers.forEach(handler => handler())
}