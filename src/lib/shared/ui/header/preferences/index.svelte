<script lang="ts">
	import { fade } from 'svelte/transition'
	import Themes from './themes.svelte'
	import Reading from './reading.svelte'
	import Reset from './reset.svelte'
	import Icon from '@iconify/svelte';
	import { Popover } from "bits-ui";
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
		<Icon icon="fluent:settings-32-regular" width="100%" />
	</div>
		
	</Popover.Trigger>
	

		{#if $windowWidth > 650}

			<Popover.Content sideOffset={13.50} align="end" >
				<div id="settings" out:fade|global={{ duration: 200 }}>
		
					<div class="preferences" >
							
						<span class="title">Preferences</span>
		
						<div class="options">
							
							<Reading />
							
							<Reset />
						</div>
					</div>
				</div>
			</Popover.Content>
		
		{:else if $windowWidth <= 650}

			<Popover.Content sideOffset={10} align="end" >
				<div id="settings" >
		
					<div class="preferences" >
							
						<span class="title">Preferences</span>
		
						<div class="options">
							
							<Reading />
							
							<Reset />
						</div>
					</div>
			</div>
			</Popover.Content>
			
		{/if}
		

</Popover.Root>	



<style>
	.container  {
		height: 31px;
		margin-top: 1px;

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
			
			height: 28px;
			
			margin-top: 5px;
		
		}

		

		.preferences {
			width: 300px;
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