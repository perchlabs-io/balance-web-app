<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte'
	import {fade} from 'svelte/transition'
		
		let isExpanded = false
	
		function clickHandler() {
			isExpanded = !isExpanded
		}
</script>

<svelte:head>
	<title>Pool</title>
</svelte:head>

<Heading>Pool</Heading>


<main>
	<h2>Coming Soon</h2>
</main>

<style>
	main {
		max-width: 60ch;
		margin-inline: auto;
		display: grid;
		row-gap: var(--spacing-32);
		margin-bottom: var(--spacing-64);
		align-items: "center";
	}
</style>