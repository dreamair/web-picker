import SidePanel from "../components/Fields.svelte";

// Action popup
// https://developer.chrome.com/docs/extensions/reference/action/

function render() {
	const target = document.getElementById("app");

	if (target) {
		new SidePanel({ target });
	}
}

document.addEventListener("DOMContentLoaded", render);
