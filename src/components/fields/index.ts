import ImageField from './ImageField.svelte'
import TextField from './TextField.svelte'

export const fieldComponents = {
	string: TextField,
	text: TextField,
	url: TextField,
	image: ImageField,
}
