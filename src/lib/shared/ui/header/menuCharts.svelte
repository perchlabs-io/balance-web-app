<script lang="ts">
	import { fade } from 'svelte/transition'
	import Icon from '@iconify/svelte';
	
	
	import { chartBoards } from '$lib/api/config'
</script>


	
<div class="container">

		<button popovertarget="menu" class="button">
			<Icon icon="cil:chart" width="100%" />
			
		</button>

		<div id="menu" popover="auto" >
			
		  	
				<div class="menu">
						
					<span class="title">Chart Boards</span>
					<ul>
						{#each Object.entries(chartBoards) as [slug, chartboard]}
							<li>
								<a href="/chartboards/{slug}">{chartboard}</a>
							</li>
						{/each}
					</ul>
				</div>
			
		</div>

		
</div>	


<style>
	
	.container  {
        height: 100%;
		position: relative; 
		anchor-name: --anchor_1;

	}

	
	
	[popover] {
		position-anchor: --anchor_1;
		position-area: bottom;
		transform: translateX(-97.5px);
		margin-top: 12.5px;
		border-width: 0px;
		background-color: var(--ba-clr-menu-bg);
		display: none;
		opacity: 0;
		transition:
			opacity 300ms,
			display 300ms allow-discrete,
			overlay 500ms allow-discrete;

		&:popover-open {
		display: block;
		opacity: 1;
  		}
		
	}

	.button {
		width: 29px;
	}

	.menu {
		width: max-content;
		background-color: var(--ba-clr-menu-bg);
		padding: var(--spacing-24);
		border-width: 0px;
		
	}
	
	.menu .title {
		display: block;
		padding-bottom: var(--spacing-24);
		font-size: var(--font-24);
		font-weight: 500;
		line-height: 32px;
		border-bottom: 2px solid var(--clr-menu-border);
		color: var(--clr-txt);
	}
	.menu a {
		font-weight: inherit;
		color: var(--clr-menu-text);
	}
	.menu a:hover {
		color: var(--clr-primary);
	}
	.menu ul {
		display: grid;
		width: 200px;
		grid-template-rows: repeat(4, 1fr);
		row-gap: var(--spacing-24);
		column-gap: var(--spacing-64);
		grid-auto-flow: column;
		margin-top: var(--spacing-24);
	}

	@media (min-width: 650px) {
		.menu ul {
			grid-template-rows: repeat(4, 1fr);
		}
	}
	
	@media (max-width: 650px) {
		.container  {
			height: 100%;
			
		}

		[popover] {
			inset: .25rem auto auto auto;
			transform: translateX(-87.5px);
			border-width: 0px;
			background-color: var(--ba-clr-menu-bg);
			display: none;
			opacity: 0;
		}

		
		
		.button {
			width: 24px;
			margin-top: 5px;
		}
		
		.menu .title {
			display: block;
			padding-bottom: var(--spacing-24);
			font-size: var(--font-20);
			font-weight: 500;
			line-height: 32px;
			border-bottom: 2px solid var(--clr-menu-border);
		}
		.menu a {
			font-size: var(--font-14);
			font-weight: inherit;
			color: var(--clr-menu-text);
			
		}
		.menu ul {
			display: grid;
			width: 175px;
			grid-template-rows: repeat(4, 1fr);
			row-gap: var(--spacing-24);
			column-gap: var(--spacing-64);
			grid-auto-flow: column;
			margin-top: var(--spacing-24);
		}
	}
  
	
</style>