<script lang="ts">
	import { fade } from 'svelte/transition'
	import Themes from './themes.svelte'
	import Reading from './reading.svelte'
	// import Dyslexic from './dyslexic.svelte'
	import Reset from './reset.svelte'
	import Icon from '@iconify/svelte';
</script>


<div class="container">

	<button popovertarget="settings" class="button">
		<Icon icon="fluent:settings-32-regular" width="100%" />
		
		
	</button>

	<div id="settings" popover class="popover">
		
		  
			<!-- <div class="menu">
					
				<span class="title">Chart Boards</span>
				<ul>
					{#each Object.entries(chartBoards) as [slug, chartboard]}
						<li>
							<a href="/chartboards/{slug}">{chartboard}</a>
						</li>
					{/each}
				</ul>
			</div> -->

			<div class="preferences">
						

				<span class="title">Preferences</span>

				<div class="options">
					
					<Reading />
					
					<Reset />
				</div>
			</div>
		
	</div>

	
</div>	

<div class="container">
	<!-- <Popover let:open class="popover">
		
		<PopoverButton aria-label="Preferences" class="icon" >
			
				<CogIcon width="29" height="29" />
			
		</PopoverButton>
		
		{#if open}
			<div transition:fade|global={{ duration: 100 }}>
				<PopoverPanel class="popover-panel" static>
					<div class="preferences">
						

						<span class="title">Preferences</span>

						<div class="options">
							
							<Reading />
							
							<Reset />
						</div>
					</div>
				</PopoverPanel>
			</div>
		{/if}
	</Popover> -->
</div>

<style>
	.container  {
        height: 100%;
		position: relative; 
		anchor-name: --anchor_1;
		

	}
	
	.popover {
		position-anchor: --anchor_1;
		position-area: bottom;
		transform: translateX(-183.5px);
		margin-top: 12px;
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
		width: 30px;
		margin-top: 2px;
	}

	.preferences {
		
		background: var(--ba-clr-menu-bg);
		padding: var(--spacing-24);
		
		box-shadow: var(--shadow-md);

		
	}
	
	
	.preferences .title {
		display: block;
		padding-bottom: var(--spacing-24);
		font-size: var(--font-24);
		font-weight: 500;
		line-height: 32px;
		border-bottom: 2px solid var(--clr-menu-border);
		color: var(--clr-txt);
	}
	.preferences .options {
		font-weight: 500;
		color: var(--clr-menu-text);
		
	}
	.preferences .options > :global(*) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-32);
		padding: var(--spacing-24) 0;
	}
	.preferences .options > :global(*:not(:last-child)) {
		border-bottom: 1px solid var(--clr-menu-border);
	}
	.preferences .options > :global(*:last-child) {
		padding-bottom: 0;
	}
	.preferences .options span {
		max-width: 180px;
	}
	@media (min-width: 650px) {
		.preferences {
			width: 420px;
		}
		.preferences .options > :global(*) {
			gap: var(--spacing-64);
		}
	}
	@media (max-width: 650px) {
		.container  {
			height: 100%;
			
			position: relative; 
			anchor-name: --anchor_1;

		

		}

		.popover {
			position-anchor: --anchor_1;
			position-area: bottom;
			transform: translateX(-106.5px);
			margin-top: 12px;
			border-width: 0px;
			background-color: var(--ba-clr-menu-bg);
			display: none;
			opacity: 0;
			
			
		}
		
		.button {
			width: 25px;
			margin-top: 6px;
		}
		
		.preferences .title {
			display: block;
			padding-bottom: var(--spacing-24);
			font-size: var(--font-20);
			font-weight: 500;
			line-height: 32px;
			border-bottom: 2px solid var(--clr-menu-border);
		}
		.preferences .options {
			font-weight: 500;
			font-size: var(--font-14);
			color: var(--clr-menu-text);
			
		}
	}

	
</style>