<script lang="ts">
	
	import Transition from '$lib/shared/transition/index.svelte'
	import { inview } from 'svelte-inview';
	import type { ObserverEventDetails, Options } from 'svelte-inview';
	import { views } from '$lib/stores/views'
	import type { PostType } from '$lib/types'
	import Icon from '@iconify/svelte';
	
	export let posts: PostType[]

	let isInView : any;
	const options: Options = {
    rootMargin: '0px',
    unobserveOnEnter: true,
	};

	const handleChange = ({ detail }: CustomEvent<ObserverEventDetails>) =>
    (isInView = detail.inView);


</script>

<section>
	<slot name="title" />

	<div class="cards" use:inview="{options}" on:inview_change="{handleChange}">

		{#if isInView}
		{#each posts as post, index}
			<Transition transition={{ type: 'stagger', duration: index, delay: 400 }}>
				<a href="/{post.slug}">
					<article class="card">
						<span class="views">
							<Icon icon="ph:eye" width="1.6em" height="1.6em" />
							
							{#if $views.length > 0}
								<span>
									{$views
										.find((data) => data.slug === post.slug)
										?.views.toLocaleString() ?? 0}
								</span>
							{/if}
							
						</span>
						<div class="details">
							<p class="title">{post.title}</p>
							<p class="description">{post.description}</p>
						</div>
					</article>
				</a>
			</Transition>
		{/each}
		{/if}
	</div>

	<slot name="see-more" />
</section>

<style>
	section {
		margin-top: var(--spacing-64);
		
	}
	.cards {
		display: grid;
		gap: var(--spacing-24);
		grid-template-columns: repeat(auto-fill, minmax(282px, 1fr));
		margin-top: var(--spacing-32);
	}
	.cards a {
		display: block;
		color: inherit;
		font-weight: inherit;
		text-decoration: none;
		transition: color 0.3s ease;
	}
	.cards a::before {
		content: none;
		
	}
	.card {
		height: 400px;
		display: grid;
		grid-template-rows: min-content;
		padding: var(--spacing-16);
		background-image: var(--ba-clr-card-bg);
		border-top: 1px solid var(--clr-menu-border);
		border-left: 1px solid var(--clr-menu-border);
		/*border-radius: var(--rounded-20);*/
		box-shadow: var(--shadow-sm);
		transition: transform 0.2s ease-in-out, box-shadow 0.3s ease,
			outline 0.1s ease;
		
	}
	.card:hover {
		transform: scale(1.02);
		box-shadow: var(--shadow-md), 0 0 0 4px var(--clr-primary);
	}
	.card .views {
		display: flex;
		align-items: center;
		gap: var(--spacing-4);
		font-weight: 500;
		color: var(--clr-card-txt);
	}
	.card .details {
		height: 100%;
		align-self: end;
	}
	.card .title {
		font-family: var(font-sans);
		font-size: var(--font-32);
		font-weight: 700;
		line-height: 48px;
		margin-top: var(--spacing-16);

	}
	html[data-font='dyslexic'] .card .title {
		font-family: var(--font-dyslexic);
		font-size: var(--font-24);
		line-height: 32px;
	}
	.card .description {
		/* height: 100%; */
		margin-top: var(--spacing-16);
		color: var(--clr-card-txt);
	}
	:global([slot='see-more']) {
		width: max-content;
		display: flex;
		gap: var(--spacing-16);
		margin-top: var(--spacing-32);
		margin-bottom: var(--spacing-105);
		
	}

	@media (max-width: 650px) {
		.card .title {
			font-family: var(font-sans);
			font-size: var(--font-22);
			font-weight: 700;
			line-height: 40px;
			margin-top: var(--spacing-16);

		}
		.card .views {
			display: flex;
			font-size: var(--font-16);
			align-items: center;
			gap: var(--spacing-4);
			font-weight: 500;
			color: var(--clr-card-txt);
		}
		.card {
			height: 300px;
			display: grid;
			grid-template-rows: min-content;
			padding: var(--spacing-16);
			background-image: var(--ba-clr-card-bg);
			border-top: 1px solid var(--clr-menu-border);
			border-left: 1px solid var(--clr-menu-border);
			/*border-radius: var(--rounded-20);*/
			box-shadow: var(--shadow-sm);
			transition: transform 0.2s ease-in-out, box-shadow 0.3s ease,
				outline 0.1s ease;
			
		}
	
	
}
</style>