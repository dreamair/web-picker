import Options from "../components/Options.svelte";

// Options
// https://developer.chrome.com/docs/extensions/mv3/options/

function render() {
	const target = document.getElementById("app");

	if (target) {
		new Options({
			target,
			props: { count: 1 },
		});
	}
}

document.addEventListener("DOMContentLoaded", render);
