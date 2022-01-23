import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		img: {
			url: 'http://img.europrimus.ninja/1952-2022/',
			dirs: {
				start: 1952,
				end: 2022
			}
		}
	}
});

export default app;
