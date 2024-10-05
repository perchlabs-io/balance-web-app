<script lang="ts">
	
	import { colorTheme } from '$lib/stores/mychart';
	import { browser } from '$app/environment'
	

	let themes : any;
	

	let selectedTheme = getTheme() ?? themes['dark']
	function getTheme() {
		if (!browser) return
		const htmlElement = document.documentElement
		const userTheme = localStorage.theme
		const prefersDarkMode = window.matchMedia(
			'prefers-color-scheme: dark'
		).matches
		const prefersLightMode = window.matchMedia(
			'prefers-color-scheme: light'
		).matches
		// check if the user set a theme
		if (userTheme) {
			htmlElement.dataset.theme = userTheme
			return themes[userTheme]
		}
		
		return themes[userTheme]
	}
	function handleChange(event: CustomEvent) {
		selectedTheme = themes[event.detail.name]
		const htmlElement = document.documentElement
		htmlElement.dataset.theme = selectedTheme.name
		localStorage.theme = selectedTheme.name
		
		//location.reload();

		colorTheme.set(selectedTheme.name)

		console.log('a', localStorage.theme)
		
		
	}

	

</script>
