<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte'
	import Newsletter from '$lib/shared/ui/newsletter.svelte'
</script>

<svelte:head>
	<title>Newsletter</title>
	<meta
		content="Subscribe for updates and tasty web development treats."
		name="description"
	/>
</svelte:head>

<Heading>Newsletter</Heading>

<div class="newsletter">
	<h3>Subscribe for updates and Spicy Network Insights</h3>
	<Newsletter />
</div>

<style>
	.newsletter {
		display: grid;
		justify-items: center;
	}
	h3 {
		margin-bottom: var(--spacing-32);
		text-transform: capitalize;
	}
	@media (min-width: 650px) {
		.newsletter {
			display: grid;
			justify-items: center;
			margin-bottom: var(--spacing-128);
		}
	}
	@media (max-width: 650px) {
		.newsletter h3{
			font-size: var(--font-14);
			font-weight: 1000;
			margin-bottom: var(--spacing-32);
			text-transform: capitalize;
			
		}
	}
</style>