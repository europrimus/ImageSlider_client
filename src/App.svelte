<script>
	import { onMount } from 'svelte';
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

	async function sheduleSwitchImg(time=1500){
		setTimeout(()=>{
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
				let currentImgElement = document.getElementById('currentImg')
				currentImg = ++currentImg % imgs.length;
				currentImgElement.src = imgs[currentImg].url;
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

	onMount(
		sheduleSwitchImg()
	);
</script>

<main>
	<h1>{getCurrentYear()}</h1>
	{#await fetching}
		Chargement ...
	{:then imgs}
		<img src="{imgs[currentImg].url}" alt="photo" id="currentImg">
	{:catch error}
		Erreur de chargement.
	{/await}
</main>

<style>

</style>
