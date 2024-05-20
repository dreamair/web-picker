import {
	imageField, stringField, textField, urlField
} from '../../model/Field.js'
import type { Message } from '../../model/Message.js'
import { domToMd, htmlToMd } from '../common/domToMd.js'

export function pickPageData() {
	return new Promise<Message>((resolve) => {
		resolve({
			action: 'setFields',
			payload: [
				urlField('url',
					matches(genericQueries.url) ?? location.href, location.href),
				stringField('title', matches(genericQueries.title)),
				textField('description', matches(genericQueries.description)),
				imageField('image', matches(genericQueries.image), location.href),
				imageField('icon', matches(genericQueries.icon), location.href),
			]
		})
	})
}

const genericQueries = {
	title: [
		'meta[property="og:title"]/@content',
		'meta[name="og:title"]/@content',
		'meta[property="twitter:title"]/@content',
		'meta[name="title"]/@content',
		'title',
		'meta[property="og:site_name"]/@content',
		'meta[name="og:site_name"]/@content',
	],
	url: [
		'link[rel="canonical"]/@href',
		'meta[property="og:url"]/@content',
		'meta[property="twitter:url"]/@content',
	],
	description: [
		'meta[property="og:description"]/@content',
		'meta[property="twitter:description"]/@content',
		'meta[name="description"]/@content',
		'meta[name="Description"]/@content',
		'p[class*="description"]',
		'div[class*="description"]', // wikipedia.org ('shortdescription')
	],
	icon: [
		'meta[property="og:logo"]/@content',
		'meta[itemprop="logo"]/@content',
		'link[rel="icon"][type]/@href',
		'link[rel~="icon"]/@href',
		'link[rel*="-icon"]/@href',
		'img[itemprop="logo"]/@src',
	],
	image: [
		'meta[property="og:image:secure_url"]/@content',
		'meta[property="og:image:url"]/@content',
		'meta[property="og:image"]/@content',
		'meta[name="og:image"]/@content',
		'meta[property="twitter:image"]/@content',
		'meta[name="twitter:image:src"]/@content',
		'meta[name="twitter:image"]/@content',
		'link[rel="image_src"]/@href',
		'#main-image-container img/@src', // amazon.com
		'img/@src',
	],
	type: [
		'meta[property="og:type"]/@content',
	],
}

function matches(patterns: string[]) {
	for (const pattern of patterns) {
		const i = pattern.indexOf('/@')
		const s = i > 0 ? pattern.substring(0, i) : pattern
		const a = i > 0 ? pattern.substring(i + 2) : null
		const match = document.querySelector(s)
		const txt = match
			? a
				? htmlToMd(match.getAttribute(a))
				: domToMd(match)
			: null
		if (txt && txt.trim()) return txt.trim()
	}
}



