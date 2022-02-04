<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	export let img;

	async function fetchImg(){
		let url = img.url + getCurrentYear();
		const request = await fetch(url, {
			method: 'GET'
		})
		return await request.json()
	}

	let currentImg = 0;
	let fetching = fetchImg();
	let switchImgTimeout;

	async function sheduleSwitchImg(time=2500){
		switchImgTimeout = setTimeout(()=>{
			switchImg()
		},time)
	}

	function switchImg(){
		fetching.then((imgs)=>{
			if(imgs.length == 0 || currentImg == imgs.length - 1){
				console.log("next dir");
				loadNextYear();
			}else{
				console.log("next img");
				currentImg = ++currentImg % imgs.length;
				sheduleSwitchImg();
			}
		})
	}

	function getCurrentYear(){
		const queryString = document.location.search;
		const params = new URLSearchParams(queryString);
		let year = parseInt(params.get("year"));
		if(isNaN(year)){
			year = img.dirs.start;
		}
		return year;
	}

	function loadNextYear(){
		const params = new URLSearchParams();
		const currentYear = getCurrentYear();
		if(currentYear < img.dirs.end){
			params.set("year",currentYear + 1)
			const url = document.location.origin + "?" + params.toString();
			document.location.replace(url);
		}else{
			console.log("last year : END");
		}
	}

	function keyHandler(event){
		const char = (typeof event !== 'undefined') ? event.keyCode : event.which;
		switch (char) {
		  case 32:
				PauseOrResume()
		    break;
			default:
				console.log('char',char);
		}
	}

	function PauseOrResume(){
		console.log('Pause or Resume');
		if(undefined == switchImgTimeout){
			switchImg()
		}else{
			clearTimeout(switchImgTimeout)
			switchImgTimeout = undefined;
		}
	}

	onMount(async () => {
			document.onkeypress = keyHandler
			sheduleSwitchImg()
		}
	);
</script>

<main>
	<h1>{getCurrentYear()}</h1>
	<div>
		{#await fetching}
			<p>Chargement ...</p>
		{:then imgs}
			{#if undefined != imgs[currentImg]}
				{#key currentImg}
					<!-- svelte-ignore a11y-missing-attribute -->
					<img src="{imgs[currentImg].url}"
						transition:fade="{{ duration: 1000 }}"
					>
				{/key}
			{:else}
				<p>Pas d'images</p>
			{/if}
		{:catch error}
			<p>Erreur de chargement.</p>
		{/await}
	</div>
</main>

<style>
h1{
	position: fixed;
	z-index: 10;
	width: 100%;
	margin: 1rem;
	text-align: center;
	font-size: 5rem;
	color: #000;
	text-shadow: #fff 0 0 1rem;
}
div{
	width: 100vw;
	height: 100vh;
	position: relative;
}
img,p{
	position: absolute;
	max-width: 100%;
	max-height: 100%;
	margin:auto;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
p{
	height: fit-content;
	width: fit-content;
	font-size: 2rem;
}
</style>
