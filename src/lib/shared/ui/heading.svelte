<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<h1>
	{@render children?.()}
</h1>

<style>
	h1 {
		margin: var(--spacing-64) 0;
		
		line-height: clamp(48px, 10vw, 112px);
		color: var(--clr-primary);
		text-align: center;
	}
	@media (min-width: 650px) {
		h1 {
			margin: var(--spacing-178) 0;
			font-size: clamp(var(--font-48), 8vw, var(--font-96));
			
		}
	}
	@media (max-width: 650px) {
		h1 {
			margin: var(--spacing-128) 0;
			font-size: clamp(var(--font-48), 8vw, var(--font-96));
			
		}
	}
	
</style>