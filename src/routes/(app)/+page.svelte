<script lang="ts">
	import { ArrowNarrowRightIcon } from '@rgossiaux/svelte-heroicons/outline'
	import type { PageServerData } from './$types'
	import Newsletter from '$lib/shared/ui/newsletter.svelte'
	import Posts from '$lib/shared/ui/posts.svelte'
	import PolyMission from '$lib/icons/polymission.svg'
	import Transition from '$lib/shared/transition/index.svelte'
	import PolyTech from '$lib/icons/polytech.svg'
	import PolyRates from '$lib/icons/polyrates.svg'
	import PolyService from '$lib/icons/polyservice.svg'
	import { browser } from '$app/environment'
	import type { ObserverEventDetails, Options } from 'svelte-inview';
	import { onMount } from "svelte";
	import { inview } from 'svelte-inview';
	import { windowWidth, windowHeight, colorTheme } from '$lib/stores/mychart';
	import {
		siteDescription,
		siteImage,
		siteName,
		siteTitle,
		siteUrl,
		twitter,
		twitterHandle,
	} from '$lib/api/config'
	export let data: PageServerData
	
	if (browser) {
		colorTheme.set(localStorage.theme)
	}

	let isInView1 : any;
	let isInView2 : any;
	let isInView3 : any;
	let isInView4 : any;
	let resetObserver : any;

	const resetInView = () => {
        isInView1 = undefined;
		isInView2 = undefined;
		isInView3 = undefined;
		isInView4 = undefined;

	
		

		
	};

    onMount(() => {
        resetInView();
		onResize();


    });

	

	const options: Options = {
    rootMargin: '0px',
    unobserveOnEnter: true,
	};

	
	const handleChange1 = ({ detail }: CustomEvent<ObserverEventDetails>) =>
    (isInView1 = detail.inView);
	const handleChange2 = ({ detail }: CustomEvent<ObserverEventDetails>) =>
    (isInView2 = detail.inView);
	const handleChange3 = ({ detail }: CustomEvent<ObserverEventDetails>) =>
    (isInView3 = detail.inView);
	const handleChange4 = ({ detail }: CustomEvent<ObserverEventDetails>) =>
    (isInView4 = detail.inView);

	const onResize = () => {
        $windowWidth = window.innerWidth;
        $windowHeight = Math.min(window.innerHeight,700);
        $colorTheme = localStorage.theme;
	
	};

	
</script>

<svelte:window
  on:load={onResize}
  on:resize={onResize}
  />

<svelte:head>
	<title>{siteTitle}</title>
	<meta
    property="og:image"
    content="https://balance-social-image.vercel.app/api/static"
  	/>

	<!-- <meta content={siteDescription} name="description" />

	<meta content={siteTitle} property="og:title" />
	<meta content={siteImage} property="og:image" />
	<meta content={siteUrl} property="og:url" />
	<meta content={siteDescription} property="og:description" />
	<meta content={siteName} property="og:site_name" /> -->

	<!-- <meta content={twitterHandle} name="twitter:creator" />
	<meta content="summary_large_image" name="twitter:card" />
	<meta content={siteTitle} name="twitter:title" />
	<meta content={siteDescription} name="twitter:description" />
	<meta content={siteImage} name="twitter:image" /> -->
</svelte:head>



<main>

	
	<section class="image">
		

		<div class="main-image" >
		{#if $windowWidth > 960}
			{#if $colorTheme == '🌛 Night'}
			<img width=700 height=615 src="./images/ba_main_image_v6.png" alt="main-image-dark">
			{:else if $colorTheme == '☀️ Daylight'}
			<img width=700 height=615 src="./images/ba_main_image_v8.png" alt="main-image-light ">
			{/if}
		{:else if $windowWidth <= 960 && $windowWidth > 650}
			{#if $colorTheme == '🌛 Night'}
			<img width=550 height=485 src="./images/ba_main_image_v6.png" alt="main-image-dark">
			{:else if $colorTheme == '☀️ Daylight'}
			<img width=550 height=485 src="./images/ba_main_image_v8.png" alt="main-image-light ">
			{/if}
		{:else if $windowWidth <= 650}
			{#if $colorTheme == '🌛 Night'}
			<img width=385 height=340 src="./images/ba_main_image_v6.png" alt="main-image-dark">
			{:else if $colorTheme == '☀️ Daylight'}
			<img width=385 height=340 src="./images/ba_main_image_v8.png" alt="main-image-light ">
			{/if}
		{/if}

		</div>
		
	</section>

	<h2 class="latest" >Chart Boards</h2>
	<section class="chart-section">
		<div class="chart-text" use:inview="{options}" on:inview_change="{handleChange1}">
			{#if isInView1}
			<Transition transition={{ type: 'slide-left', duration: 1, delay: 400 }}>
			<div>
			
			<h3 class="ba-text-header"><a href="/chartboards/decentralization">Group Stake v. Leverage</a></h3>
			<p class="ba-text">Group Stake vs Leverage provides detailed historical analysis of stake pool groups and individual stake pools as they have formed over time (epoch 210 through current). The chart highlights MAV count per epoch along with the pool groups which make up the MAV. Drag the epoch slider to epoch 210, then click “Play“ to watch the ecosystem evolve. Special thanks to Dr. Michael Liesenfelt and Christophe Garant for their work on CIP-50.</p>
			</div>	
			</Transition>
			{/if}
		</div>
		
		<div class="chart-divider" />

		<div class="chart-image" use:inview="{options}" on:inview_change="{handleChange1}">
			{#if isInView1}
			<Transition transition={{ type: 'slide-right', duration: 1, delay: 400 }}>
				{#if $colorTheme == '🌛 Night'}
				<a href="/chartboards/decentralization"><img src="/images/ba_svl_image_dark.png" alt="main-image-dark"></a>
				{:else if $colorTheme == '☀️ Daylight'}
				<a href="/chartboards/decentralization"><img src="/images/ba_svl_image_light.png" alt="main-image-light "></a>
				{/if}
			</Transition>
			{/if}
		</div>
	</section>

	<section class="chart-section-reverse">
		<div class="chart-text-reverse" use:inview="{options}" on:inview_change="{handleChange2}">
			{#if isInView2}
			<Transition transition={{ type: 'slide-right', duration: 1, delay: 400 }}>
				<div>
			<h3 class="ba-text-header"><a href="/chartboards/decentralization">Average Resulting Decentralization</a></h3>
			<p class="ba-text">Average Resulting Decentralization provides summary analysis of network decentralization history from epoch 210 through current. The “average resulting decentralization” or “effective decentralization“ take into account groups or entities of stake pools. One group could be running multiple stake pools, which lowers the realistic, effective decentralization.</p>
				</div>	
			</Transition>
			{/if}
		</div>

		<div class="chart-divider-reverse" />

		<div class="chart-image-reverse" use:inview="{options}" on:inview_change="{handleChange2}">
			{#if isInView2}
			<Transition transition={{ type: 'slide-left', duration: 1, delay: 400 }}>
				{#if $colorTheme == '🌛 Night'}
				<a href="/chartboards/decentralization"><img src="/images/ba_ard_image_dark.png" alt="main-image-dark"></a>
				{:else if $colorTheme == '☀️ Daylight'}
				<a href="/chartboards/decentralization"><img src="/images/ba_ard_image_light.png" alt="main-image-light"></a>
				{/if}
			</Transition>
			{/if}
		</div>
	</section>

	<section class="chart-section">
		<div class="chart-text" use:inview="{options}" on:inview_change="{handleChange3}">
			{#if isInView3}
			<Transition transition={{ type: 'slide-left', duration: 1, delay: 400 }}>
				<div>
			<h3 class="ba-text-header"><a href="/chartboards/donut_shop">Group Stake Donut</a></h3>
			<p class="ba-text">Group Stake Donut brings elevated pool group analysis through a timeless visualization, the “Donut Chart”. Reveal key group dimension insights including MAV group highlights through intuitive chart object interactions. Explore further by analyzing the 4 pool group data “perspectives”, each transforming chart objects to represent either Stake, Pledge, Delegates, or Pool Count.</p>
				</div>	
			</Transition>
			{/if}
		</div>

		<div class="chart-divider" />

		<div class="chart-image" use:inview="{options}" on:inview_change="{handleChange3}">
			{#if isInView3}
			<Transition transition={{ type: 'slide-right', duration: 1, delay: 400 }}>
				{#if $colorTheme == '🌛 Night'}
				<a href="/chartboards/donut_shop"><img src="/images/ba_gsd_image_dark.png" alt="main-image-dark"></a>
				{:else if $colorTheme == '☀️ Daylight'}
				<a href="/chartboards/donut_shop"><img src="/images/ba_gsd_image_light.png" alt="main-image-light "></a>
				{/if}
			</Transition>
			{/if}
		</div>
	</section>

	<section class="chart-section-reverse"  >
		<div class="chart-text-reverse" use:inview="{options}" on:inview_change="{handleChange4}">

		{#if isInView4}
			<Transition transition={{ type: 'slide-right', duration: 1, delay: 400 }}>
				<div>
			<h3 class="ba-text-header"><a href="/chartboards/utxo_allocation">UTxO Allocation</a></h3>
			<p class="ba-text">UTxO Allocation provides insights regarding portion of ADA in circulation that is not delegated.  Much is known about delegated ADA, but few facts exist for ADA that is not delegated.  The UTxO Allocation charts work to address this by providing ADA delegation history across 5 delegation categories.  Explore the historical allocation data for each category and perform compare & contrast analysis of delta values to identify possible correlations.</p>
				</div>	
			</Transition>
			{/if}
		</div>

		<div class="chart-divider-reverse" />

		<div class="chart-image-reverse" use:inview="{options}" on:inview_change="{handleChange4}">
			{#if isInView4}
			<Transition transition={{ type: 'slide-left', duration: 1, delay: 400 }}>
				{#if $colorTheme == '🌛 Night'}
				<a href="/chartboards/utxo_allocation"><img src="/images/ba_utxo_image_dark.png" alt="main-image-dark"></a>
				{:else if $colorTheme == '☀️ Daylight'}
				<a href="/chartboards/utxo_allocation"><img src="/images/ba_utxo_image_light.png" alt="main-image-light "></a>
				{/if}
			</Transition>
			{/if}
		</div>
	</section>

	<!--
	<Posts posts={data.posts.popular}>
		<h3 class="popular" slot="title">Popular</h3>
	</Posts>
	-->

	
	<Posts posts={data.posts.latest}>
		<h2 class="latest" slot="title">Latest Articles</h2>
		<a slot="see-more" href="/articles">
			<span>See more articles</span>
			<ArrowNarrowRightIcon width="24" height="24" aria-hidden="true" />
		</a>
	</Posts>
	

	<!--
	<Posts posts={data.posts.series}>
		<h3 class="series" slot="title">Series</h3>
		<a slot="see-more" href="/series">
			<span>See more series</span>
			<ArrowNarrowRightIcon width="24" height="24" aria-hidden="true" />
		</a>
	</Posts>

	<Posts posts={data.posts.picks}>
		<h3 class="picks" slot="title">Picks</h3>
	</Posts>
	-->

	
	<section class="info-section">
		<div class="info-image">
			<PolyMission  stroke= var(--clr-primary) fill= var(--clr-primary)/>
		</div>

		<div class="info-divider" />

		
		<div class="info-text">
			<h3 class="ba-text-header">Mission Statement</h3>

			<p class="ba-text">Our mission is to provide the Cardano Community with accurate, insightful decentralized network data analysis to make informed decisions and maximize success. We strive to provide exceptional curated on-chain analysis and data visualization for Cardano, and become the defacto gold standard for years to come.</p>
		</div>
	</section>

	<section class="info-section">
		<div class="info-text">
			<h3 class="ba-text-header">Pool Technology</h3>
			<p class="ba-text"><b class="ba-text-primary">BALNC Pool</b> is a self-hosted, baremetal rack server hosting the blockchain database and supporting decentralization.</p>
		</div>

		<div class="info-divider" />

		<div class="info-image">
			<PolyTech  stroke= var(--clr-primary) fill= var(--clr-primary)/>
		</div>
	</section>

	<section class="info-section">
		<div class="info-text">
			<h3 class="ba-text-header">Pool Rates</h3>
			<p class="ba-text">As of January 2024, <b class="ba-text-primary">BALNC Pool</b> rates are a min fee of <b class="ba-text-primary">170 Ada</b> (the lowest) and a margin fee of <b class="ba-text-primary">0.00%</b>. This means from the rewards of validating blocks, 170A is deducted, and the remainder is provided to you the delegators.  These rates are very competitive and the pool rewards support our Analysis Services to serve the Community. We have a high pledge of <b class="ba-text-primary">400k Ada</b> to help win blocks and protect the network from Sybil Attacks.</p>
		</div>

		<div class="info-divider" />

		<div class="info-image">
			<PolyRates  stroke= var(--clr-primary) fill= var(--clr-primary)/>
		</div>
	</section>

	<section class="info-section">
		<div class="info-text">
			<h3 class="ba-text-header">Product & Services</h3>
			<p class="ba-text">BALANCE provides Newsletters with Cardano blockchain events, stakepool landscape & grouping changes, and on-chain analysis state of the network updates. We also have the entire blockchain database (not just an index) to query and provide curated data visualization insights thru our Web Application. Please explore our site and visit the charts!</p>
		</div>

		<div class="info-divider" />

		<div class="info-image">
			<PolyService  stroke= var(--clr-primary) fill= var(--clr-primary)/>
		</div>
	</section>

	

		

</main>

<style>
	

	.info-section {
		margin-top: var(--spacing-16);
		padding: var(--spacing-24);
		
	}

	.chart-section {
		margin-top: var(--spacing-18);
		padding: var(--spacing-24);
		
	}
	.chart-image {
		border-radius: 0px;

	}

	.chart-section-reverse {
		margin-top: var(--spacing-18);
		padding: var(--spacing-24);
		
	}
	.chart-image-reverse {
		border-radius: 0px;
		
	}
	.latest {
		margin-top: var(--spacing-105);

	}

	.ba-text {
		
		color: var(--clr-card-txt);
	}
	.ba-text-primary {
		
		color: var(--clr-primary);
	}
	.ba-text-header {
		
		margin-bottom: var(--spacing-16);
	}
	
	.image {
		display: grid;
		margin-top: var(--spacing-64);
		margin-bottom: var(--spacing-105);
		
	}
	.main-image {
		display: flex;
		justify-content: center;
		position: relative;
		top: 50%;
		left: 50%;
  		transform: translate(-50%, -50%);
		
		
		
	}
	
	@media (min-width: 960px) {
		.chart-section {
			display: grid;
			grid-template-columns: repeat(11, [column-start] 1fr);
			column-gap: var(--spacing-8);
		}

		.chart-text {
			display: flex;
			align-items: center;
        	justify-content: center;
			grid-column: column-start 1 / span 5;
		}

		.chart-divider {
			grid-column: column-start 6 / span 1;
			
			justify-self: center;
			margin: 0;
			border-left: 1.5px solid var(--clr-primary);
			margin-bottom: none;
		}

		.chart-image {
			
			display: flex;
        	align-items: center;
        	justify-content: center;
			grid-column: column-start 7 / span 5;
			min-height: 300px;
			
		}

		.chart-section-reverse {
			display: grid;
			grid-template-columns: repeat(11, [column-start] 1fr);
			column-gap: var(--spacing-8);
		}

		.chart-image-reverse {
			
			display: flex;
        	align-items: center;
        	justify-content: center;
			grid-column: column-start 1 / span 5;
			order: 1;
			min-height: 300px;
			
		}
		.chart-divider-reverse {
			grid-column: column-start 6 / span 1;
			justify-self: center;
			margin: 0;
			border-left: 1.5px solid var(--clr-primary);
			margin-bottom: none;
			order: 2;
		}

		.chart-text-reverse {
			
			grid-column: column-start 7 / span 5;
			order: 3;
		}

		
	}
	
	@media (min-width: 860px) {
		
		.info-section {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			column-gap: var(--spacing-8);
		}
		
		
		.info-text {
			grid-column: column-start 5 / span 7;
			order: 3;
		}
		
		
		.info-divider {
			grid-column: column-start 4 / span 1;
			justify-self: center;
			margin: 0;
			border-left: 1.5px solid var(--clr-primary);
			margin-bottom: none;
			order: 2;
		}
		
		
		.info-image {
			
			display: flex;
        	align-items: center;
        	justify-content: center;
			grid-column: column-start 2 / span 2;
			max-width: 145px;
			order: 1;
			

			
		}
		
		
		.image {
			display: grid;
			grid-template-columns: repeat(1, [column-start] 1fr);
			
		}
		.main-image {
			grid-column: column-start 1 / span 1;
			
			
		}
	}

	@media (max-width: 960px) {
		.chart-section {
			display: grid;
			grid-template-columns: repeat(11, [column-start] 1fr);
			column-gap: var(--spacing-8);
		}
		
		.chart-text {
			grid-column: column-start 1 / span 11;
			order: 2;
		}
		.chart-divider {
			display: none;
			
		}
		.chart-image {
			
			display: flex;
        	align-items: center;
        	justify-content: center;
			grid-column: column-start 1 / span 11;
			margin-bottom: var(--spacing-24);
			order: 1;
			
			
		}
		.chart-section-reverse {
			display: grid;
			grid-template-columns: repeat(11, [column-start] 1fr);
			column-gap: var(--spacing-8);
		}
		
		.chart-text-reverse {
			grid-column: column-start 1 / span 11;
			order: 2;
			
		}
		.chart-divider-reverse {
			display: none;
			
		}
		
		.chart-image-reverse {
			
			display: flex;
        	align-items: center;
        	justify-content: center;
			grid-column: column-start 1 / span 11;
			margin-bottom: var(--spacing-24);
			order: 1;
			
		}
	}

	@media (max-width: 860px) {
		.info-image {
			
			display: none;
        	align-items: center;
        	justify-content: center;
			grid-column: column-start 10 / span 2;
			min-width: 100px;
			
		}
		

		
	}

	
</style>


