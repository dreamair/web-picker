
export function cropImage(dataUrl: string,
	rect: { left: number; top: number; width: number; height: number }) {
	return new Promise<string>((resolve) => {
		const img = new Image()
		img.onload = function () {
			const canvas = document.createElement('canvas')
			canvas.width = rect.width
			canvas.height = rect.height
			const ctx = canvas.getContext('2d')
			ctx?.drawImage(img,
				rect.left, rect.top, rect.width, rect.height,
				0, 0, canvas.width, canvas.height
			)
			const croppedDataUrl = canvas.toDataURL('image/png')
			resolve(croppedDataUrl)
		}
		img.crossOrigin = 'Anonymous'
		img.src = dataUrl
	})
}

export function dataURLtoBlob(dataUrl: string) {
	const arr = dataUrl.split(',')
	if (arr.length < 2) return null
	const mime = arr[0].match(/:(.*?);/)?.[1]
	const bstr = atob(arr[1])
	let n = bstr.length
	const u8arr = new Uint8Array(n)
	while (n--)
		u8arr[n] = bstr.charCodeAt(n)
	return new Blob([u8arr], { type: mime })
}

