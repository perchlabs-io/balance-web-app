<script lang="ts">
	import { fly } from 'svelte/transition'
	import { page } from '$app/stores'
	type Transition = {
		type: 'fade' | 'stagger' | 'page' | 'slide-right' | 'slide-left'
		duration?: number
		delay?: number
	}
	export let transition: Transition

	
  
</script>

{#if transition.type === 'page'}
	{#key $page.url}
		<div in:fly={{ y: -50, duration: 250 }}>
			<slot />
		</div>
	{/key}
{/if}

{#if transition.type === 'fade'}
	<div
		class="fade"
		style:animation-duration="{transition.duration}ms"
		style:animation-delay="{transition.delay}ms"
	>
		<slot />
	</div>
{/if}

{#if transition.type === 'stagger'  && transition.duration != undefined}
	<div
		class="stagger"
		style:animation-duration="{transition.duration * 300}ms"
		style:animation-delay="{transition.delay}ms"
		
	>
	
		<slot />
	
	</div>
{/if}

{#if transition.type === 'slide-right'  && transition.duration != undefined}
	<div
		class="slide-right"
		style:animation-duration="{transition.duration * 300}ms"
		style:animation-delay="{transition.delay}ms"
		
	>
	
		<slot />
	
	</div>
{/if}


{#if transition.type === 'slide-left'  && transition.duration != undefined}
	<div
		class="slide-left"
		style:animation-duration="{transition.duration * 300}ms"
		style:animation-delay="{transition.delay}ms"
		
	>
	
		<slot />
	
	</div>
{/if}



<style>
	div {
		height: 100%;
	}
	.fade {
		animation-name: fadeIn;
	}
	.stagger {
		opacity: 0;
		animation-name: stagger;
		animation-fill-mode: forwards;
	}
	.slide-right {
		opacity: 0;
		animation-name: slide-right;
		animation-fill-mode: forwards;
		display: flex;
        align-items: center;
        justify-content: center;
	}
	.slide-left {
		opacity: 0;
		animation-name: slide-left;
		animation-fill-mode: forwards;
		display: flex;
        align-items: center;
        justify-content: center;
	}
	
	
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes stagger {
		from {
			opacity: 0;
			transform: translateY(75px);
		}
		to {
			opacity: 1;
			transform: translateY(0px);
		}
	}
	@keyframes slide-right {
		from {
			opacity: 0;
			transform: translateX(200px);
		}
		to {
			opacity: 1;
			transform: translateX(0px);
		}
	}
	@keyframes slide-left {
		from {
			opacity: 0;
			transform: translateX(-200px);
		}
		to {
			opacity: 1;
			transform: translateX(0px);
		}
	}
	
</style>