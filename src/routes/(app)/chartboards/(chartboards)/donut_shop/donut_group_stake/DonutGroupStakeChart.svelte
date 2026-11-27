<script lang="ts">
	//*** imports ***//
	import * as d3 from 'd3';
	import debounceFn from 'lodash.debounce';
	import { onMount, untrack } from 'svelte';
	import { donutWidth, donutHeight, colorTheme } from '$lib/stores/mychart';
	import DonutCenterTooltip from './components/DonutCenterTooltip.svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	// import {interpolate} from d3-interpolate;

	//*** props ***//
	interface Props {
		donutData: any;
		curMAVData: any;
		maxEpochData: any;
	}

	let { donutData, curMAVData, maxEpochData }: Props = $props();

	//*** define variables and types ***//

	let pie: any;
	let piePledge: any;
	let piePool: any;
	let pieDelegate: any;
	let hoveredData: any = $state();
	let hoverState: any = $state(false);
	let stateDetailed: any = $state(false);
	let stateCenter: any = $state(false);
	const padAngle = 0.005;
	const cornerRadius = 10;

	let debounce = 10000000000;
	let popOutFactor = 1.05; //[105%] for pie section pop out animation on mouse over
	let buttonSelected: string = $state('stake');

	$donutWidth = 100;

	const onResize = () => {
		$donutWidth = window.innerWidth;
		$donutHeight = Math.min(window.innerHeight, 700);
		$colorTheme = localStorage.theme;
	};

	let latestEpochMAV = $derived(curMAVData[maxEpochData][0].mc);
	let latestEpoch = $derived(maxEpochData);

	// mount and redraw svg in lifecycle
	onMount(() => {
		onResize();
	});

	//*************************/
	//Color Work
	//*************************/

	//after much trial and error, this combination in light mode is not as yellowy bright or blood moon orange
	//compromise on the yellow brightness in day mode can barely see the chart looking into the sun effect
	//this gives enough red and orange to see the chart but not dominate.
	const colorsNight = d3.piecewise(d3.interpolateHsl, [
		'hsla(128, 100%, 67%, 1)', //green smalled groups
		// "hsla(58, 100%, 80%, 1)",   //yellow middle
		// "hsla(237, 100%, 61%, 1)",  //blue middle
		'hsla(17, 100%, 67%, 1)', //light orange
		// "hsla(17, 100%, 55%, 1)",   //dark orange
		'hsla(5, 100%, 67%, 1)', //lighter red
		'hsla(0, 100%, 67%, 1)'
	]); //red biggest mav
	// "hsla(0, 100%, 55%, 1)"])   //dark red biggest mav

	const colorsDay = d3.piecewise(d3.interpolateHsl, [
		'hsla(128, 66%, 57%, 1)', //green smalled groups
		// "hsla(58, 100%, 80%, 1)",   //yellow middle
		// "hsla(237, 100%, 61%, 1)",  //blue middle
		'hsla(11, 100%, 60%, 1)', //light orange
		// "hsla(17, 100%, 55%, 1)",   //dark orange
		'hsla(5, 99%, 63%, 1)', //lighter red
		'hsla(0, 99%, 63%, 1)'
	]); //red biggest mav
	// "hsla(0, 100%, 55%, 1)"])   //dark red biggest mav

	// max values
	const max_mav_prctstake = $derived(
		Math.max(...donutData.filter((d: any) => d.mavgroup === 'true').map((d: any) => d.prctstake))
	);

	//*************************/
	//Donut Drawing - Pie and Arc Features from D3
	//*************************/
	pie = d3
		.pie()
		.value((d: any) => d.stake)
		.sort((a: any, b: any) => b.stake - a.stake);

	piePledge = d3
		.pie()
		.value((d: any) => d.pledge)
		.sort((a: any, b: any) => b.pledge - a.pledge);

	piePool = d3
		.pie()
		.value((d: any) => d.poolcount)
		.sort((a: any, b: any) => b.poolcount - a.poolcount);

	pieDelegate = d3
		.pie()
		.value((d: any) => d.delegatecount)
		.sort((a: any, b: any) => b.delegatecount - a.delegatecount);

	const params = {
		delay: 100,
		duration: 750,
		easing: cubicOut
	};

	//create arc function
	let arc: any = $derived(
		d3
			.arc()
			.innerRadius((Math.min($donutWidth, $donutHeight) / 2) * 0.6 * (1 / popOutFactor))
			.outerRadius((Math.min($donutWidth, $donutHeight) / 2) * 1.0 * (1 / popOutFactor))
			.cornerRadius(cornerRadius)
			.padAngle(padAngle)
			.padRadius((Math.min($donutWidth, $donutHeight) / 2) * 0.6 * (1 / popOutFactor))
	);

	//draw pop out arc section
	let arc_pop_out: any = $derived(
		d3
			.arc()
			.innerRadius((Math.min($donutWidth, $donutHeight) / 2) * 0.6)
			.outerRadius((Math.min($donutWidth, $donutHeight) / 2) * 1.0)
			.cornerRadius(cornerRadius)
			.padAngle(padAngle)
			.padRadius((Math.min($donutWidth, $donutHeight) / 2) * 0.6)
	);

	//create pie data for the selected groupby button
	const pieByButton: Record<string, any> = {
		stake: pie,
		pledge: piePledge,
		pool: piePool,
		delegator: pieDelegate
	};
	let pie_data = $derived(pieByButton[buttonSelected](donutData));

	//create dynamic tweened data based on button select functions below
	const tData = tweened(
		untrack(() => pie_data),
		params
	);

	$effect(() => {
		tData.set(pie_data);
	});

	//button select groupby functions
	const showStake = () => {
		buttonSelected = 'stake';
	};

	const showPledge = () => {
		buttonSelected = 'pledge';
	};

	const showPool = () => {
		buttonSelected = 'pool';
	};

	const showDelegate = () => {
		buttonSelected = 'delegator';
	};

	//*************************/
	//Chart Info - Expand / Collapse Feature
	//*************************/

	//chart info
	let chartTitle = 'Group Stake Donut Chart';
	let chartInfo =
		'The donut charts portray stake pool groups by percentage of the whole, or pie sections, grouped by the selected data below (e.g. by Stake, Pledge, Pool Count, or Delegator Count).';
	let showContent = $state('');

	//function to handle chart title box click action for details
	const handleClick = (payload: any) => {
		showContent = payload === showContent ? '' : payload;
	};

	//*************************/
	//Chart Function Handler State Machine
	//*************************/

	// Function to handle mouse over pie section
	const pieSectionMouseOver = (event: MouseEvent, d: any): void => {
		hoveredData = d;
		hoverState = true;
	};

	// Function to handle mouse click pie section
	const pieSectionMouseClick = (event: MouseEvent): void => {
		hoverState = false;
		stateDetailed = true;
	};

	// Function to handle mouse leave pie section
	const pieSectionMouseLeave = (event: MouseEvent): void => {
		hoveredData = null;
		stateDetailed = false;
		hoverState = false;
	};

	// Function to handle mouse over pie center
	const pieCenterMouseOver = (event: MouseEvent): void => {
		stateCenter = true;
	};

	// Function to handle mouse click pie center
	const pieCenterMouseClick = (event: MouseEvent): void => {
		stateCenter = true;
	};

	// Function to handle mouse leave pie center
	const pieCenterMouseLeave = (event: MouseEvent): void => {
		stateCenter = false;
	};
</script>

<svelte:window onload={onResize} onresize={debounceFn(onResize, debounce)} />

<section class="heroheader">
	<button class="charttitle" type="button" onclick={() => handleClick(chartTitle)}
		><h4 class="heroheadertext">{chartTitle}</h4></button
	>
	{#if showContent === chartTitle}
		<p class="chartdetail" transition:slide|global={{ duration: 200 }}>
			{chartInfo}
		</p>
	{/if}
</section>

<section class="button-container">
	{#if buttonSelected === 'stake'}
		<button class="donutchartdetailbuttons_stake_active"><h4>By Stake</h4></button>
	{:else}
		<button class="donutchartdetailbuttons_stake" type="button" onclick={showStake}
			><h4>By Stake</h4></button
		>
	{/if}

	{#if buttonSelected === 'pledge'}
		<button class="donutchartdetailbuttons_pledge_active"><h4>By Pledge</h4></button>
	{:else}
		<button class="donutchartdetailbuttons_pledge" type="button" onclick={showPledge}
			><h4>By Pledge</h4></button
		>
	{/if}

	{#if buttonSelected === 'pool'}
		<button class="donutchartdetailbuttons_pool_active"><h4>By Pools</h4></button>
	{:else}
		<button class="donutchartdetailbuttons_pool" type="button" onclick={showPool}
			><h4>By Pools</h4></button
		>
	{/if}

	{#if buttonSelected === 'delegator'}
		<button class="donutchartdetailbuttons_delegate_active"><h4>By Delegators</h4></button>
	{:else}
		<button class="donutchartdetailbuttons_delegate" type="button" onclick={showDelegate}
			><h4>By Delegators</h4></button
		>
	{/if}
</section>

<section class="hero">
	<div class="chart-container" bind:clientWidth={$donutWidth} bind:clientHeight={$donutHeight}>
		<svg width={$donutWidth} height={$donutWidth + 40}>
			<g transform="translate({$donutWidth / 2} {$donutHeight / 2})">
				{#each $tData as d, i}
					{#if d.data.mavgroup === 'false' && d.data.label === 'SINGLEPOOL'}
						<path
							d={hoveredData == d ? arc_pop_out(d) : arc(d)}
							fill={stateCenter == true && d.data.mavgroup == 'true'
								? 'hsla(294, 100%, 45%, 1)'
								: stateCenter == true && d.data.mavgroup == 'false'
									? 'grey'
									: $colorTheme == '☀️ Daylight'
										? 'hsla(128, 66%, 57%, 1)'
										: 'hsla(128, 100%, 67%, 1)'}
							stroke={'hsla(0% 0% 0% 0%)'}
							stroke-width=".1%"
							onmouseover={(e) => pieSectionMouseOver(e, d)}
							onmouseleave={(e) => pieSectionMouseLeave(e)}
							onfocus={() => {}}
							onclick={(e) => pieSectionMouseClick(e)}
							onkeypress={() => {}}
						/>
					{:else}
						<path
							d={hoveredData == d ? arc_pop_out(d) : arc(d)}
							fill={stateCenter == true && d.data.mavgroup == 'true'
								? 'hsla(294, 100%, 45%, 1)'
								: stateCenter == true && d.data.mavgroup == 'false'
									? 'grey'
									: $colorTheme == '☀️ Daylight'
										? colorsDay(Math.pow(d.data.prctstake / max_mav_prctstake, 1))
										: colorsNight(Math.pow(d.data.prctstake / max_mav_prctstake, 1))}
							stroke={'hsla(0% 0% 0% 0%)'}
							stroke-width=".1%"
							onmouseover={(e) => pieSectionMouseOver(e, d)}
							onmouseleave={(e) => pieSectionMouseLeave(e)}
							onfocus={() => {}}
							onclick={(e) => pieSectionMouseClick(e)}
							onkeypress={() => {}}
						/>
					{/if}
				{/each}
			</g>

			<DonutCenterTooltip
				data={hoveredData}
				width={$donutWidth}
				height={$donutHeight}
				{latestEpoch}
				{latestEpochMAV}
				{hoverState}
				{stateDetailed}
				{stateCenter}
				{buttonSelected}
			/>

			<circle
				id="MAVCircle"
				cx={$donutWidth / 2}
				cy={$donutHeight / 2}
				r={(Math.min($donutWidth, $donutHeight) / 2) * 0.4}
				fill="transparent"
				onmouseover={(e) => pieCenterMouseOver(e)}
				onmouseleave={(e) => pieCenterMouseLeave(e)}
				onfocus={() => {}}
				onclick={(e) => pieCenterMouseClick(e)}
				onkeypress={() => {}}
			/>
		</svg>
	</div>
</section>

<style>
	.hero {
		margin-top: var(--spacing-16);
		margin-bottom: var(--spacing-98);
		padding: var(--spacing-24);
	}

	.heroheader {
		display: grid;
	}

	.heroheadertext {
		justify-content: center;
		margin-top: 8px;
		margin-bottom: 8px;

		font-size: 20px;
		letter-spacing: 0.25px;
	}

	.chart-container {
		max-height: 700px;
		display: flex;
		justify-content: center;
	}

	.charttitle {
		font-weight: 700;
		display: flex;
		justify-content: center;
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		background: var(--ba-clr-title-bg);
		border-top: 1px solid var(--clr-menu-border);
		border-left: 1px solid var(--clr-menu-border);
		border-radius: 0;

		transition:
			transform 0.2s ease-in-out,
			box-shadow 0.3s ease,
			outline 0.1s ease;
	}

	.charttitle:hover {
		transform: scale(1.01);
		box-shadow:
			var(--shadow-md),
			0 0 0 3px var(--clr-primary);
	}
	.chartdetail {
		gap: var(--spacing-16);
		padding: var(--spacing-18);
	}

	.button-container {
		margin-top: var(--spacing-16);
		display: flex;
		flex-wrap: wrap;
		row-gap: var(--spacing-16);
		align-items: center;
		align-self: start;
	}

	.donutchartdetailbuttons_stake_active {
		display: flex;
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: 18px;
		padding-bottom: 18px;

		border-radius: 0;
		box-shadow:
			var(--shadow-md),
			0 0 0 2px var(--clr-primary);
		border: 1.5px solid var(--clr-menu-border);
		transition:
			box-shadow 0.3s ease,
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.donutchartdetailbuttons_stake {
		display: flex;
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: 18px;
		padding-bottom: 18px;

		border-radius: 0;

		border: 1.5px solid var(--clr-menu-border);
		transition:
			box-shadow 0.3s ease,
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.donutchartdetailbuttons_stake:hover {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		box-shadow: 0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_stake:focus {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		box-shadow: 0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_stake:active {
		transition: box-shadow 0.07s ease;
		transform: scale(1.01);
		border-radius: 0;
		box-shadow:
			var(--shadow-md),
			0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_pledge_active {
		display: flex;
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: 18px;
		padding-bottom: 18px;

		border-radius: 0;
		box-shadow:
			var(--shadow-md),
			0 0 0 2px var(--clr-primary);
		border: 1.5px solid var(--clr-menu-border);
		transition:
			box-shadow 0.3s ease,
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.donutchartdetailbuttons_pledge {
		display: flex;
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: 18px;
		padding-bottom: 18px;

		border-radius: 0;

		border: 1.5px solid var(--clr-menu-border);
		transition:
			box-shadow 0.3s ease,
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.donutchartdetailbuttons_pledge:hover {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		box-shadow: 0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_pledge:focus {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		box-shadow: 0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_pledge:active {
		transition: box-shadow 0.07s ease;
		transform: scale(1.01);
		border-radius: 0;
		box-shadow:
			var(--shadow-md),
			0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_pool_active {
		display: flex;
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: 18px;
		padding-bottom: 18px;

		border-radius: 0;
		box-shadow:
			var(--shadow-md),
			0 0 0 3px var(--clr-primary);
		border: 1.5px solid var(--clr-menu-border);
		transition:
			box-shadow 0.3s ease,
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.donutchartdetailbuttons_pool {
		display: flex;
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: 18px;
		padding-bottom: 18px;

		border-radius: 0;

		border: 1.5px solid var(--clr-menu-border);
		transition:
			box-shadow 0.3s ease,
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.donutchartdetailbuttons_pool:hover {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		box-shadow: 0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_pool:focus {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		box-shadow: 0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_pool:active {
		transition: box-shadow 0.07s ease;
		transform: scale(1.01);
		border-radius: 0;
		box-shadow:
			var(--shadow-md),
			0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_delegate_active {
		display: flex;
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: 18px;
		padding-bottom: 18px;

		box-shadow:
			var(--shadow-md),
			0 0 0 2px var(--clr-primary);
		border: 1.5px solid var(--clr-menu-border);
		transition:
			box-shadow 0.3s ease,
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.donutchartdetailbuttons_delegate {
		display: flex;
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: 18px;
		padding-bottom: 18px;

		border: 1.5px solid var(--clr-menu-border);
		transition:
			box-shadow 0.3s ease,
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.donutchartdetailbuttons_delegate:hover {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		box-shadow: 0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_delegate:focus {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		box-shadow: 0 0 0 2px var(--clr-primary);
	}

	.donutchartdetailbuttons_delegate:active {
		transition: box-shadow 0.07s ease;
		transform: scale(1.01);
		border-radius: 0;
		box-shadow:
			var(--shadow-md),
			0 0 0 3px var(--clr-primary);
	}

	@media (min-width: 1060px) {
		.hero {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}
		.heroheader {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}

		.chart-container {
			grid-column: column-start 1 / span 12;
		}

		.charttitle {
			grid-column: column-start 1 / span 12;
		}
		.chartdetail {
			grid-column: column-start 2 / span 10;
		}

		.button-container {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}

		.donutchartdetailbuttons_stake_active {
			grid-column: column-start 1 / span 3;
		}

		.donutchartdetailbuttons_stake {
			grid-column: column-start 1 / span 3;
		}

		.donutchartdetailbuttons_pledge_active {
			grid-column: column-start 4 / span 3;
		}

		.donutchartdetailbuttons_pledge {
			grid-column: column-start 4 / span 3;
		}

		.donutchartdetailbuttons_pool_active {
			grid-column: column-start 7 / span 3;
		}

		.donutchartdetailbuttons_pool {
			grid-column: column-start 7 / span 3;
		}

		.donutchartdetailbuttons_delegate_active {
			grid-column: column-start 10 / span 3;
		}

		.donutchartdetailbuttons_delegate {
			grid-column: column-start 10 / span 3;
		}
	}

	@media (max-width: 1060px) {
		.hero {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}
		.heroheader {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}
		.button-container {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}
		.chart-container {
			grid-column: column-start 1 / span 12;
		}
		.charttitle {
			grid-column: column-start 1 / span 12;
		}
		.chartdetail {
			grid-column: column-start 2 / span 10;
		}
		.donutchartdetailbuttons_stake_active {
			grid-column: column-start 1 / span 6;
		}

		.donutchartdetailbuttons_stake {
			grid-column: column-start 1 / span 6;
		}

		.donutchartdetailbuttons_pledge_active {
			grid-column: column-start 7 / span 6;
		}

		.donutchartdetailbuttons_pledge {
			grid-column: column-start 7 / span 6;
		}

		.donutchartdetailbuttons_pool_active {
			grid-column: column-start 1 / span 6;
		}

		.donutchartdetailbuttons_pool {
			grid-column: column-start 1 / span 6;
		}

		.donutchartdetailbuttons_delegate_active {
			grid-column: column-start 7 / span 6;
		}

		.donutchartdetailbuttons_delegate {
			grid-column: column-start 7 / span 6;
		}
	}

	@media (max-width: 650px) {
		.hero {
			margin-top: var(--spacing-16);
			padding: var(--spacing-4);
		}
		.heroheadertext {
			margin-top: 8px;
			margin-bottom: 8px;
			font-size: 18px;
			letter-spacing: 0.25px;
		}
	}
</style>
