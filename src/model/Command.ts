
export type Command = {
	action: 'pick' | 'pick-screenshot' | 'pick-pageData'
	key?: string
}

export function toggleCommand(cmd: Command) {
	return (lastCmd: Command | null) =>
		lastCmd?.key === cmd.key && lastCmd?.action === cmd.action ? null : cmd
}
