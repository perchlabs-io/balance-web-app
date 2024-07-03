<script lang="ts">
	import Header from '$lib/shared/ui/header/header.svelte'
	import Footer from '$lib/shared/ui/footer/footer.svelte'
	import Transition from '$lib/shared/transition/index.svelte'
	import '../../styles/styles.scss'
	import { ArrowUpIcon } from '@rgossiaux/svelte-heroicons/outline'

	
	import { supabaseClient } from '$lib/supabase.ts'
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	
	import {fade} from 'svelte/transition'
	import {Circle3, Chasing, Jumper, Square, Pulse} from 'svelte-loading-spinners'
	import {navigationIsDelayed} from '$lib/stores/loading'

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
 
	inject({ mode: dev ? 'development' : 'production' });

	export let showOnPx = 750;
	let hidden = true;

	
	const goTop = () => {
		document.body.scrollIntoView();
	}

	const scrollContainer = () => {
		return document.documentElement || document.body;
	}

	const handleOnScroll = () => {
		if (!scrollContainer()) {
		return;
		}

		if (scrollContainer().scrollTop > showOnPx) {
		hidden = false;
		} else {
		hidden = true;
		}
	}
	
	

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth')
		})
		return () => {
			subscription.unsubscribe()
		}
	})
</script>

<svelte:window on:scroll={handleOnScroll} />

{#if $navigationIsDelayed}
		<div class="loading" in:fade={{ duration: 150 }}>
			<div class="absolute w-full h-full  opacity-50 z-10"></div>
			<div class="absolute w-full h-full flex justify-center items-center z-20">
			<Pulse />
			</div>
		</div>
{/if}

{#if !$navigationIsDelayed}

<Transition transition={{ type: 'fade', duration: 250 }}>
	<div class="grid">
		
		<Header />
		<Transition transition={{ type: 'page' }}>
			<slot />
		</Transition>
		<Footer />
	</div>

	
	<div><button class="back-to-top" on:click={goTop} class:hidden><ArrowUpIcon width="40" height="40" /></button></div>
	
</Transition>

{/if}

<style>
	:global(.grid) {
		/*
			this messes with the sticky nav bar...do not use
		height: 100%;
		*/
		max-width: 1200px;
		display: grid;
		grid-template-columns: repeat(12, [column-start] 1fr);
		column-gap: var(--spacing-24);
		margin-inline: auto;
		padding: 0 var(--spacing-16);
	}
	:global(.grid > *) {
		grid-column: column-start / span 12;
	}
	.loading {
		display: flex;
  		justify-content: center;
  		align-items: center;
  		text-align: center;
  		min-height: 100vh;
		
	}
	.back-to-top {
		opacity: 1;
		position: fixed;
		z-index: 99;
		right: 50px;
		user-select: none;
		bottom: 70px;
		background-color: var(--clr-primary);
		color: var(--clr-bg);
		border-radius: var(--rounded-4);
		box-shadow: 0 0 0 2px var(--clr-primary);
		transition: all 0.4s ease-in-out;
	}
	.back-to-top:hover {
		
		box-shadow: 0 0 0 5px var(--clr-primary);
		
		
	}

	.back-to-top.hidden {
		opacity: 0;
		visibility: hidden;
	}
	
	
	@media (min-width: 1240px) {
		.grid {
			padding: 0;
		}
		
		
	}
</style>