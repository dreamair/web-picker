

export interface Area {
	left: number
	top: number
	width: number
	height: number
}

export function scaleArea(area: Area, scale: number): Area {
	return {
		left: area.left * scale,
		top: area.top * scale,
		width: area.width * scale,
		height: area.height * scale,
	}
}
