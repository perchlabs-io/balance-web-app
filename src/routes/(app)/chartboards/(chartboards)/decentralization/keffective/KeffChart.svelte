<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte'
	import { scaleLog, scaleLinear, scaleTime } from "d3-scale";
	import Line_Keff from "./components/Line.svelte";
	import { ChartPieIcon } from '@rgossiaux/svelte-heroicons/solid'
	import { windowWidth, windowHeight, colorTheme } from '$lib/stores/mychart';

	export let keffData : any;
	
	

	let chartTitle = 'Average Resulting Decentralization';
	let chartInfo = 'This chart displays the average MAV and the weighted average resulting decentralization or "effective decentralization" over time by taking into account pool groupings.';
	

	const marginMobile = { top: 15, right: 40, bottom: 52, left: 20 };
	const margin = { top: 15, right: 45, bottom: 52, left: 30 };
	let height = 400;
	let width = 400;
	let innerHeight = height - margin.top - margin.bottom;



	$: innerWidth = width - margin.left - margin.right;
	$: innerWidthMobile = width - marginMobile.left - marginMobile.right;
	
	const yScale = scaleLog()
	  .domain([10, 70]) // INPUT
	  .range([innerHeight, 0]); // OUTPUT
	
	const minEpoch = (keffData.mav[0].epoch);
	const maxEpoch = (keffData.mav[keffData.mav.length - 1].epoch);
	$: xScale = scaleLinear()
	  .domain([minEpoch, maxEpoch]) // INPUT
	  .range([10, innerWidth]); // OUTPUT

	$: xScaleMobile = scaleLinear()
	  .domain([minEpoch, maxEpoch]) // INPUT
	  .range([10, innerWidthMobile]); // OUTPUT
	const MAV_COLOR = "#FF6166";
	const KEFF_COLOR = "#32BAFF";
	const KEFF2_COLOR = "#FFCA64";
	import AxisX_Keff from "./components/AxisX.svelte";
	import AxisY_Keff from "./components/AxisY.svelte";
	import HoverEvents_Keff from "./components/HoverEvents.svelte";
	import Tooltip_Keff from "./components/Tooltip.svelte";
	let hoveredEpoch = maxEpoch;
	let isHovered = false;

	//*************************/
	//Chart Info - Expand / Collapse Feature
	//*************************/
	
	import { fade, scale, slide } from 'svelte/transition';

	let showContent = ''

	const handleClick = (payload : any) => {
  
		showContent = payload === showContent ? '' : payload
	}
	
	const handleQAClose = () => {
		showContent = ''
		
	}

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
	

	<section class="heroheader">
		
		<button class="charttitle" type="button" on:click={() => handleClick(chartTitle)}><h4 class="heroheadertext" >{chartTitle}</h4></button>
		{#if showContent === chartTitle}
		<p class="chartdetail" transition:slide={{ duration: 200 }}>
			{chartInfo}
			
		</p>
		
		
		{/if}
	</section>

	<section class="inputbox" >
		
		<div class="mavlegend">
			<h4>K-Effective</h4><ChartPieIcon style="color:{KEFF_COLOR};"  width="17" /><h4>K-Effective / 2</h4><ChartPieIcon style="color:{KEFF2_COLOR};" width="17" /><h4>MAV</h4><ChartPieIcon style="color:{MAV_COLOR};" width="17" />
		</div>
		

	</section>
  
	<section class="hero">
  	
	<div class="chart-container" bind:clientWidth={width}>
	  
	  <svg
		{width}
		{height}
		aria-labelledby="chart-title"
		aria-describedby="chart-description"
		role="img"
	  >
		{#if $windowWidth > 650}
		<g transform="translate({margin.left} {margin.top})">
		  <AxisX_Keff
			height={innerHeight}
			width={innerWidth}
			{xScale}
			{hoveredEpoch}
			
			isUnhovered={isHovered === false}
			windowWidth={$windowWidth}
		  />
		  <AxisY_Keff width={innerWidth} {yScale} />
  
		  <Line_Keff
			{xScale}
			{yScale}
			data={keffData.mav}
			color={MAV_COLOR}
			{hoveredEpoch}
		  />
		  <Line_Keff
			{xScale}
			{yScale}
			data={keffData.keff}
			color={KEFF_COLOR}
			{hoveredEpoch}
		  />
		  <Line_Keff
			{xScale}
			{yScale}
			data={keffData.keff2}
			color={KEFF2_COLOR}
			{hoveredEpoch}
		  />
  
		  <HoverEvents_Keff
			width={innerWidth}
			height={innerHeight}
			{xScale}
			{margin}
			{maxEpoch}
			bind:isHovered
			bind:hoveredEpoch
		  />
  
		  <Tooltip_Keff
			{hoveredEpoch}
			{xScale}
			{yScale}
			data={keffData.mav}
			color={MAV_COLOR}
		  />
		  <Tooltip_Keff
			{hoveredEpoch}
			{xScale}
			{yScale}
			data={keffData.keff}
			color={KEFF_COLOR}
		  />
		  <Tooltip_Keff
			{hoveredEpoch}
			{xScale}
			{yScale}
			data={keffData.keff2}
			color={KEFF2_COLOR}
		  />
		</g>
		{:else if $windowWidth <= 650}
		<g transform="translate({marginMobile.left} {marginMobile.top})">
			<AxisX_Keff
			  height={innerHeight}
			  width={innerWidthMobile}
			  xScale={xScaleMobile}
			  {hoveredEpoch}
			  isUnhovered={hoveredEpoch === maxEpoch}
			  windowWidth={$windowWidth}
			/>
			<AxisY_Keff width={innerWidthMobile} {yScale} />
	
			<Line_Keff
			  xScale={xScaleMobile}
			  {yScale}
			  data={keffData.mav}
			  color={MAV_COLOR}
			  {hoveredEpoch}
			/>
			<Line_Keff
			  xScale={xScaleMobile}
			  {yScale}
			  data={keffData.keff}
			  color={KEFF_COLOR}
			  {hoveredEpoch}
			/>
			<Line_Keff
			  xScale={xScaleMobile}
			  {yScale}
			  data={keffData.keff2}
			  color={KEFF2_COLOR}
			  {hoveredEpoch}
			/>
	
			<HoverEvents_Keff
			  width={innerWidth}
			  height={innerHeight}
			  xScale={xScaleMobile}
			  margin={marginMobile}
			  {maxEpoch}
			  bind:hoveredEpoch
			/>
	
			<Tooltip_Keff
			  {hoveredEpoch}
			  xScale={xScaleMobile}
			  {yScale}
			  data={keffData.mav}
			  color={MAV_COLOR}
			/>
			<Tooltip_Keff
			  {hoveredEpoch}
			  xScale={xScaleMobile}
			  {yScale}
			  data={keffData.keff}
			  color={KEFF_COLOR}
			/>
			<Tooltip_Keff
			  {hoveredEpoch}
			  xScale={xScaleMobile}
			  {yScale}
			  data={keffData.keff2}
			  color={KEFF2_COLOR}
			/>
		  </g>

		{/if}
	  </svg>
	
  </div>
	</section>


  
  <style>
	.hero {
		margin-top: var(--spacing-16);
		margin-bottom: var(--spacing-98);
		padding: var(--spacing-24);
		
	}
	.inputbox {
		margin-top: var(--spacing-16);
		display: grid;
		row-gap: var(--spacing-16);
		align-items: center;
		align-self: start;
		
	}
	.heroheader {
		margin-top: var(--spacing-128);
		display: grid;
		
	}

	.heroheadertext {
		margin-top: 8px;
		margin-bottom: 8px;
		
		font-size: 20px;
		letter-spacing: .25px;
			
	}

	.mavlegend {
		display: flex;
		justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		align-items: center;
		border: 1.5px solid var(--clr-menu-border);
		

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
		
		transition: transform 0.2s ease-in-out, box-shadow 0.3s ease,
			outline 0.1s ease;
		/*
      	I assume this prevents the card from flickering on hover
      	by triggering hardware-accelerated rendering
    	*/
		transform: translateZ(0);

	}
	.charttitle:hover {
		transform: scale(1.01);
		box-shadow: var(--shadow-md), 0 0 0 3px var(--clr-primary);
	}
	.chartdetail {
		gap: var(--spacing-16);
		padding: var(--spacing-18);
		

	}

	@media (min-width: 860px) {
		.hero {
			display: grid;
			grid-template-columns: repeat(1, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}
		.heroheader {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}
		.inputbox {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}
		.mavlegend {
			grid-column: column-start 1 / span 12 ;

		}
		.charttitle {
			
			grid-column: column-start 1 / span 12 ;
		}
		.chartdetail {
			
			grid-column: column-start 2 / span 10 ;
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
			letter-spacing: .25px;
				
		}
		
 	 }
  </style>