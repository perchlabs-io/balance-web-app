<script lang="ts">
	// import MenuCategories from './menuCategories.svelte'
	import MenuCharts from './menuCharts.svelte'
	import ThemeToggle from './themeToggle.svelte'
	import Preferences from './preferences/index.svelte'
	import { siteName } from '$lib/api/config'
	import { colorTheme } from '$lib/stores/mychart';
	

	let previousY: number
	let currentY: number
	let clientHeight: number

	$: curTheme = {colorTheme};

	const deriveDirection = (y: number) => {
		const direction = !previousY || previousY < y ? 'down' : 'up'
		previousY = y

		return direction
	}

	$: scrollDirection = deriveDirection(currentY)
	$: offscreen = scrollDirection === 'down' && currentY > clientHeight * 4

	
</script>

<section 
	class="hero"
	class:motion-safe:-translate-y-full={offscreen}
>
<header>

	
	<div class="logo">
		<img class="image" src="/images/ba_header_logo.png" ><a class="title"  href="/">{siteName}</a>
	</div>

	<nav>
		
		<div class="theme">
			<ThemeToggle />
		</div>
		<div class="settings">
			<Preferences />
		</div>
		<div class="charts">
			<MenuCharts />
		</div>
		
	</nav>
	
</header>
</section>

<style>
	header {
		position: sticky;
		
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		align-items: center;
		align-self: start;
		
		
	}
	
	.logo {
		grid-column: 1 / 1;
		display: flex;
		text-align: center;
		
		text-transform: uppercase;
		margin-right: auto;
		
		
	}
	.logo a::before {
		content: none;
		
	}
	.image {
		width: 36px;
		height: 35px;
		

	}
	.title {
		font-size: var(--font-32);
		letter-spacing: 2px;
		/* transition:  color 0.3s ease-in-out; */
		text-indent: 13px;
		
	}
	
	.title:hover {
		color: var(--clr-txt);
		
	}

	.hero {
		position: sticky;
		top: 0; 
		
		margin-top: var(--spacing-16);
		padding: var(--spacing-12);
		z-index: 99;
		border-top: 1px solid var(--clr-menu-border);
		border-left: 1px solid var(--clr-menu-border);
		backdrop-filter: blur(4px);
		box-shadow: var(--shadow-sm);
	}

	.hero::before {
		content: "";
		
		background: var(--ba-header-bg);
		background-size: cover;
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		opacity: 0.5;
	}
	
	nav {
		grid-column: 3 / 3;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		display: flex;
		grid-gap: var(--spacing-24);
		margin-left: auto;
		align-items: center;
		/* align-content: space-evenly; */
		/* justify-items: end; */
		
	}
	nav :global(svg) {
		cursor: pointer;
	}

	.theme {
    grid-column: 1 / 1;
    
  	}

	.settings {
    grid-column: 2 / 1;
    
  	}

	.charts {
    grid-column: 3 / 1;
    
  	}

	@media (max-width: 650px) {
		.image {
		width: 26px;
		height: 25px;

		}
		.title {
		font-size: var(--font-22);
		letter-spacing: 1px;
		/* transition:  color 0.3s ease-in-out; */
		text-indent: 13px;
		padding-top: 1.10px;
		
		}
		nav {
		

			grid-column: 3 / 3;
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			display: flex;
			grid-gap: var(--spacing-24);
			margin-left: auto;
			align-items: center;
			
			margin-top: -7px;
		}

		.theme {
			grid-column: 1 / 1;
			
			
		}

		.settings {
			grid-column: 2 / 1;
			
		}

		.charts {
			grid-column: 3 / 1;
			
		}
	}

</style>