import { pickImage } from './image.js'
import { pickPageData } from './pageData.js'
import { pickScreenshot } from './screenshot.js'
import { pickText } from './text.js'
import { pickUrl } from './url.js'

export const pickers = {
	text: pickText,
	url: pickUrl,
	image: pickImage,
	screenshot: pickScreenshot,
	pageData: pickPageData,
}