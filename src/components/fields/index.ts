import ImageField from './ImageField.svelte'
import NumberField from './NumberField.svelte'
import TextField from './TextField.svelte'

export const fieldComponents = {
	string: TextField,
	text: TextField,
	number: NumberField,
	url: TextField,
	image: ImageField,
}
