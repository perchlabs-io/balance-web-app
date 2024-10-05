<script lang="ts">
	import { fade } from 'svelte/transition'
	import Icon from '@iconify/svelte';
	import { Popover } from "bits-ui";
	import { chartBoards } from '$lib/api/config'
	import { windowWidth } from '$lib/stores/mychart';
	import { onMount } from "svelte";

	onMount(() => {
		onResize();
    });

	const onResize = () => {
        $windowWidth = window.innerWidth;
    };
	
</script>

<svelte:window
  on:load={onResize}
  on:resize={onResize}
  />

<Popover.Root>
	
	<Popover.Trigger>
	<div class="container">
		<Icon icon="cil:chart" width="100%" />
	</div>
		
	</Popover.Trigger>

	{#if $windowWidth > 650}

		<Popover.Content sideOffset={13.40} align="end" alignOffset={12}>
			<div class="menu" out:fade|global={{ duration: 200 }}>
							
				<span class="title">Chart Boards</span>
				<ul>
					{#each Object.entries(chartBoards) as [slug, chartboard]}
						<li>
							<a href="/chartboards/{slug}">{chartboard}</a>
						</li>
					{/each}
				</ul>
			</div>
		</Popover.Content>

	{:else if $windowWidth <= 650}

		<Popover.Content sideOffset={10.40} align="end" alignOffset={12}>
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
		</Popover.Content>

	{/if}

</Popover.Root>	

<style>

	.container  {
		height: 29px;
		margin-top: 2px;
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
		width: 225px;
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
			height: 24px;
			margin-top: 7px;
		
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