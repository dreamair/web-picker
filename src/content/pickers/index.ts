import { pickImage } from './image.js'
import { pickNumber } from './number.js'
import { pickPageData } from './pageData.js'
import { cancelElementPicker } from './pickElement.js'
import { pickScreenshot } from './screenshot.js'
import { pickText } from './text.js'
import { pickUrl } from './url.js'

export const pickers = {
	string: pickText,
	text: pickText,
	number: pickNumber,
	url: pickUrl,
	image: pickImage,
	screenshot: pickScreenshot,
	pageData: pickPageData,
}

export function cancelPickers() {
	cancelElementPicker()
}