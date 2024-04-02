<script lang="ts">
	import {
		ArrowNarrowRightIcon,
		MailIcon,
		PencilAltIcon,
	} from '@rgossiaux/svelte-heroicons/outline'
	import Newsletter from '$lib/shared/ui/newsletter.svelte'
	import { twitter, matrix } from '$lib/api/config'
	import Heart from '@rgossiaux/svelte-heroicons/outline/Heart'
	export let preset: 'delegate' | 'matrix' | 'newsletter'
</script>

{#if preset === 'delegate'}
	<div class="card">
		<div class="decorative">
			<Heart width="24" height="24" aria-hidden="true" />
		</div>
		<span class="title">Delegate</span>
		<p class="text">

			If you would like to support future research and blockchain analytics, 
			please consider delegating to <b>Balance Stake Pool - [BALNC]</b>.
		</p>
		
	</div>
{/if}

{#if preset === 'matrix'}
	<div class="card">
		<div class="decorative">
			<PencilAltIcon width="24" height="24" aria-hidden="true" />
		</div>

		<span class="title">Join The Discussion</span>
		<p class="text">
			Join the BALANCE Matrix server to get involved and meet the team.  Stop by 
			today to help build a more resilient blockchain network.
		</p>
		<a class="link" href={matrix} target="_blank" rel="noreferrer">
			<span>Join BALANCE Matrix Server</span>

			<ArrowNarrowRightIcon width="24" height="24" aria-hidden="true" />
		</a>
	</div>
{/if}

{#if preset === 'newsletter'}
	<div class="card">
		<div class="decorative">
			<MailIcon width="24" height="24" aria-hidden="true" />
		</div>
		<span class="title">Subscribe to our Newsletter</span>
		<Newsletter />
		<span class="subscribe">
			Catch the latest highlights on <a href={twitter} target="_blank" rel="noreferrer">Twitter</a> .
		</span>
	</div>
{/if}

<style>
	.card {
		position: relative;
		padding: var(--spacing-32);
		border: 4px solid var(--clr-primary);
		border-radius: var(--rounded-20);
	}
	.card .decorative {
		display: grid;
		place-content: center;
		width: 48px;
		height: 48px;
		position: absolute;
		top: 0;
		left: 0;
		transform: translateX(-50%) translateY(-50%);
		border-radius: 50%;
		background-color: var(--clr-bg);
	}
	.card .decorative :global(svg) {
		color: var(--clr-primary);
	}
	.card .title {
		font-size: var(--font-24);
		font-weight: 700;
		line-height: 32px;
	}
	.card .text {
		color: var(--clr-card-txt);
		margin-top: var(--spacing-8);
		margin-bottom: var(--spacing-32);
	}
	.card .link {
		width: max-content;
		display: flex;
		gap: var(--spacing-16);
	}
	.card :global(form) {
		margin: var(--spacing-16) 0;
	}
</style>