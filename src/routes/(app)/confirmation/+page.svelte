<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte'
	import Newsletter from '$lib/shared/ui/newsletter.svelte'
	
</script>

<svelte:head>
	<title>Confirmation</title>
	<meta
		content="Subscribe for updates and tasty web development treats."
		name="description"
	/>
</svelte:head>

<Heading>Subscription Confirmed</Heading>

<div class="newsletter">
	<h3>Thank you for subscribing to the BALANCE newsletter.</h3>
	<h4 class="sub-text">Embark with us as we explore the blockchain rabbit hole in pursuit of network resiliance & decntralization.  This might take a while, so be sure to bring snacks. 🍔</h4>
	<a
			class="link"
			href="/"
			
		>
			

			
			<span>Return to BALANCE</span>
		</a>
</div>

<style>
	.newsletter {
		display: grid;
		justify-items: center;
	}
	h3 {
		margin-bottom: var(--spacing-32);
		text-transform: capitalize;
		font-size: var(--font-32);
		line-height: var(--spacing-42);
		justify-items: center;
		text-align : center;
		
	}
	.sub-text {
		font-size: var(--font-22);
		font-weight: 300;
		justify-content: center;
		line-height: var(--spacing-32);
		margin-bottom: var(--spacing-32);
		text-align : center;

	}
	.link {
		width: max-content;
		display: flex;
		gap: var(--spacing-16);
	}
	@media (min-width: 860px) {
		.newsletter {
			display: grid;
			justify-items: center;
			margin-bottom: var(--spacing-128);
		}
		
	}
</style>