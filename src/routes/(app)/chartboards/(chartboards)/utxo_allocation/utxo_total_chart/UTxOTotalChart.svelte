<script lang="ts">
  
    //*** imports ***//
    import * as d3 from 'd3';
    import debounceFn from "lodash.debounce";
    import { onMount } from "svelte";
    import { windowWidth, windowHeight, colorTheme } from '$lib/stores/mychart';
    import AxisX from "./components/AxisX.svelte";
    import AxisY from "./components/AxisY.svelte";
    import { scaleLinear, scaleLog } from "d3-scale";
	import { line } from "d3-shape";
    import Line from "./components/Line.svelte";
    import Area from "./components/Area.svelte";
    import HoverEvents_UTxO from "./components/HoverEvents.svelte";
	import Tooltip_UTxO from "./components/Tooltip.svelte";
	import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
	import { select } from "d3-selection";
	import { zoom, zoomIdentity } from "d3-zoom";
	import { fade, scale, slide } from 'svelte/transition';
	// import { ChartPieIcon } from '@rgossiaux/svelte-heroicons/solid'
	import Icon from '@iconify/svelte';
	

    
    export let epochData : any;

    const margin = { top: 15, right: 65, bottom: 55, left: 65 };
	const marginMobile = { top: 15, right: 50, bottom: 55, left: 45 };
	let height = 500;
	let width = 400;
	let innerHeight = height - margin.top - margin.bottom;

	let utxoChart : any;

	$: innerWidth = width - margin.left - margin.right;
	$: innerWidthMobile = width - marginMobile.left - marginMobile.right;

	let currWindowWidth = $windowWidth;
    let debounce = 10000000000;

    const onResize = () => {
        $windowWidth = window.innerWidth;
        $windowHeight = Math.min(window.innerHeight,700);
        $colorTheme = localStorage.theme;
	};

	let totalMax : any;
	let totalHighArray : any;

	let totalHighDelegated : any;
	let totalHighRPDelegated : any;
	let totalHighNotDelegated : any;
	let totalHighNeverDelegated : any;
	let totalHighCommercial : any;
	
	let totalShowDelegated = false;
	let totalShowRPDelegated = true;
	let totalShowNotDelegated = false;
	let totalShowNeverDelegated = false;
	let totalShowCommercial = false;
    

    $: yScale = scaleLinear()
	  .domain([0, totalMax]) // INPUT
	  .range([innerHeight, 0]); // OUTPUT
	
	const minEpoch = (epochData[0].epoch);
	const maxEpoch = (epochData[epochData.length - 1].epoch);

    let hoveredEpoch = maxEpoch;
	let isHovered = false;

	$: xScale = scaleLinear()
	  .domain([minEpoch, maxEpoch]) // INPUT
	  .range([10, innerWidth]); // OUTPUT

	$: xScaleMobile = scaleLinear()
	  .domain([minEpoch, maxEpoch]) // INPUT
	  .range([10, innerWidthMobile]); // OUTPUT

	const DELEGATED_COLOR = "#55DF96";
	const RP_DELEGATED_COLOR = "#32BAFF";
	const NOT_DELEGATED_COLOR = "#FFCA64";
	const NEVER_DELEGATED_COLOR = "#BD64FF";
    const COMMERCIAL_COLOR = "#FF6464";

	export let utxoTotalData : any;

    const params = {
		delay: 100,
		duration: 750,
		easing: cubicOut
	  };

	const tData = tweened(utxoTotalData, params);
	  
	$: tData.set(utxoTotalData);

	
    $: xScaleZoom = xScale;
	$: xScaleZoomMobile = xScaleMobile;
	$: yScaleZoom = yScale;

	onMount(() => {
        onResize();

		

	const element = select(utxoChart);
		element.call(
			zoom()
				.scaleExtent([1, 20])
				.extent([
					[0, 0],
					[width, height]
				])
				.translateExtent([
					[0, 0],
					[width, height]
				])
				.on("zoom", (event) => {

					xScaleZoom = event.transform.rescaleX(xScale);
					xScaleZoomMobile = event.transform.rescaleX(xScaleMobile);
					yScaleZoom = event.transform.rescaleY(yScale);

				})
				
		)
    });

	totalHighDelegated = Math.max(...$tData['delegated'].map((o : any) => o.high))
	totalHighRPDelegated = Math.max(...$tData['rp_delegated'].map((o : any) => o.high))
	totalHighNotDelegated = Math.max(...$tData['not_delegated'].map((o : any) => o.high))
	totalHighNeverDelegated = Math.max(...$tData['never_delegated'].map((o : any) => o.high))
	totalHighCommercial = Math.max(...$tData['commercial'].map((o : any) => o.high))

	
	let totalMaxBase : any;
	

	$: totalMaxBase = totalHighRPDelegated
	$: totalMax = totalMaxBase + (totalMaxBase * .10)

	let showContent = ''
	let chartTitle = 'UTxO Allocation Balance Per Category';
	let chartInfo = 'The UTxO Allocation Balance chart provides focused analysis of historical ADA balances per selected UTxO category and offers enhanced data exploration UX through D3 Zoom capabilities.';

	

	const handleClick = (payload : any) => {
  
		showContent = payload === showContent ? '' : payload
	}

	
	const showDelegated = () => {
		

		if (totalShowDelegated != false) {


		} else if (totalShowDelegated == false) {

			totalMaxBase = totalHighDelegated
			totalMax = totalMaxBase + (totalMaxBase * .10)
			
			totalShowDelegated = true;
			totalShowRPDelegated = false;
			totalShowNotDelegated = false;
			totalShowNeverDelegated = false;
			totalShowCommercial = false;

			const element = select(utxoChart);
				element.call(
					zoom()
						.transform, zoomIdentity
			
				)

			xScaleZoom = xScale;
			xScaleZoomMobile = xScaleMobile;
			yScaleZoom = yScale;


		} 

		}

	const showRPDelegated = () => {


		if (totalShowRPDelegated != false) {


		} else if (totalShowRPDelegated == false) {

			totalMaxBase = totalHighRPDelegated
			totalMax = totalMaxBase + (totalMaxBase * .10)
			
			totalShowDelegated = false;
			totalShowRPDelegated = true;
			totalShowNotDelegated = false;
			totalShowNeverDelegated = false;
			totalShowCommercial = false;

			const element = select(utxoChart);
				element.call(
					zoom()
						.transform, zoomIdentity
			
				)

			xScaleZoom = xScale;
			xScaleZoomMobile = xScaleMobile;
			yScaleZoom = yScale;

		}

		}

		const showNotDelegated = () => {

			if (totalShowNotDelegated != false) {


			} else if (totalShowNotDelegated == false) {

				totalMaxBase = totalHighNotDelegated
				totalMax = totalMaxBase + (totalMaxBase * .10)
				
				totalShowDelegated = false;
				totalShowRPDelegated = false;
				totalShowNotDelegated = true;
				totalShowNeverDelegated = false;
				totalShowCommercial = false;

				const element = select(utxoChart);
					element.call(
						zoom()
							.transform, zoomIdentity
				
					)

				xScaleZoom = xScale;
				xScaleZoomMobile = xScaleMobile;
				yScaleZoom = yScale;


		}

		}

	const showNeverDelegated = () => {


			if (totalShowNeverDelegated != false) {


			} else if (totalShowNeverDelegated == false) {

				totalMaxBase = totalHighNeverDelegated
				totalMax = totalMaxBase + (totalMaxBase * .10)
				
				totalShowDelegated = false;
				totalShowRPDelegated = false;
				totalShowNotDelegated = false;
				totalShowNeverDelegated = true;
				totalShowCommercial = false;

				const element = select(utxoChart);
					element.call(
						zoom()
							.transform, zoomIdentity
				
					)

				xScaleZoom = xScale;
				xScaleZoomMobile = xScaleMobile;
				yScaleZoom = yScale;

			
		}

		}

	const showCommercial = () => {

		if (totalShowCommercial != false) {


		} else if (totalShowCommercial == false) {

			totalMaxBase = totalHighCommercial
			totalMax = totalMaxBase + (totalMaxBase * .10)
			
			totalShowDelegated = false;
			totalShowRPDelegated = false;
			totalShowNotDelegated = false;
			totalShowNeverDelegated = false;
			totalShowCommercial = true;

			const element = select(utxoChart);
				element.call(
					zoom()
						.transform, zoomIdentity
			
				)

			xScaleZoom = xScale;
			xScaleZoomMobile = xScaleMobile;
			yScaleZoom = yScale;

		}

		}


</script>

<svelte:window
  on:load={onResize}
  on:resize={debounceFn(onResize, debounce)}
  on:resize={onResize}
  />

  <section class="heroheader">
	
	<button class="charttitle" type="button" on:click={() => handleClick(chartTitle)}><h4 class="heroheadertext" >{chartTitle}</h4></button>
	{#if showContent === chartTitle}
	<p class="chartdetail" transition:slide|global={{ duration: 200 }}>
		{chartInfo}
		
	</p>
	
	
	{/if}
  </section>

  <section class="button-container">
    {#if totalShowDelegated === true}
        <button class="linechartdetailbuttons_delegated_active" type="button" on:click={() => showDelegated()}><h4>Delegated</h4><Icon icon="fa:pie-chart" style="color:{DELEGATED_COLOR}"  width="17" /></button>
    {:else}
        <button class="linechartdetailbuttons_delegated" type="button" on:click={() => showDelegated()}><h4>Delegated</h4><Icon icon="fa:pie-chart" style="color:{DELEGATED_COLOR}"  width="17" /></button>
    {/if}

    {#if totalShowRPDelegated === true}
        <button class="linechartdetailbuttons_rpdelegated_active" type="button" on:click={() => showRPDelegated()}><h4>Retired Pool</h4><Icon icon="fa:pie-chart" style="color:{RP_DELEGATED_COLOR}"  width="17" /></button>
    {:else}
        <button class="linechartdetailbuttons_rpdelegated" type="button" on:click={() => showRPDelegated()}><h4>Retired Pool</h4><Icon icon="fa:pie-chart" style="color:{RP_DELEGATED_COLOR}"  width="17" /></button>
    {/if}

    {#if totalShowNotDelegated === true}
        <button class="linechartdetailbuttons_notdelegated_active"type="button" on:click={() => showNotDelegated()}><h4>Not Delegated</h4><Icon icon="fa:pie-chart" style="color:{NOT_DELEGATED_COLOR}"  width="17" /></button>
    {:else}
        <button class="linechartdetailbuttons_notdelegated" type="button" on:click={() => showNotDelegated()}><h4>Not Delegated</h4><Icon icon="fa:pie-chart" style="color:{NOT_DELEGATED_COLOR}"  width="17" /></button>
    {/if}

    {#if totalShowNeverDelegated === true}
        <button class="linechartdetailbuttons_neverdelegated_active" type="button" on:click={() => showNeverDelegated()}><h4>Never Delegated</h4><Icon icon="fa:pie-chart" style="color:{NEVER_DELEGATED_COLOR}"  width="17" /></button>
    {:else}
        <button class="linechartdetailbuttons_neverdelegated" type="button" on:click={() => showNeverDelegated()}><h4>Never Delegated</h4><Icon icon="fa:pie-chart" style="color:{NEVER_DELEGATED_COLOR}"  width="17" /></button>
    {/if}

	{#if totalShowCommercial === true}
        <button class="linechartdetailbuttons_commercial_active" type="button" on:click={() => showCommercial()}><h4>Ineligible</h4><Icon icon="fa:pie-chart" style="color:{COMMERCIAL_COLOR}"  width="17" /></button>
    {:else}
        <button class="linechartdetailbuttons_commercial" type="button" on:click={() => showCommercial()}><h4>Ineligible</h4><Icon icon="fa:pie-chart" style="color:{COMMERCIAL_COLOR}"  width="17" /></button>
    {/if}
	
  </section>


  <section class="hero">
		
		
    <div class='chart-container' 
		bind:clientWidth={width}
      
      >
	<svg
	  bind:this={utxoChart}
	  {width}
	  {height}
	  aria-labelledby="chart-title"
	  aria-describedby="chart-description"
	  role="img"
	  
	  
	>
	{#if $windowWidth > 650}
	<defs>
		<clipPath id="group-2">
		<rect x="0" y="0" width={innerWidth} height={innerHeight} />
		</clipPath>
	</defs>
		
		<g transform="translate({margin.left} {margin.top})">
			<AxisX
			height={innerHeight}
			width={innerWidth}
			{xScale}
			{xScaleZoom}
			{hoveredEpoch}
			isUnhovered={isHovered === false}
		  />
		  <AxisY 
		  	width={innerWidth} 
			{yScale} 
			{yScaleZoom}
		  />

		</g>

		 
		<g clip-path="url(#group-2)" transform="translate({margin.left} {margin.top})">
  
		{#if totalShowDelegated === true}
			<Line
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.delegated}
				color={DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.delegated}
				color={DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		{/if}

		{#if totalShowRPDelegated === true}
			<Line
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.rp_delegated}
				color={RP_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.rp_delegated}
				color={RP_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		{/if}

		{#if totalShowNotDelegated === true}
			<Line
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.not_delegated}
				color={NOT_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.not_delegated}
				color={NOT_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		{/if}
		  
		{#if totalShowNeverDelegated === true}
			<Line
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.never_delegated}
				color={NEVER_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.never_delegated}
				color={NEVER_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		{/if}

		{#if totalShowCommercial === true}
			<Line
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.commercial}
				color={COMMERCIAL_COLOR}
				{hoveredEpoch}
			/>

			<Area
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.commercial}
				color={COMMERCIAL_COLOR}
				{hoveredEpoch}
			/>
		{/if}
		  
		
		</g>

		<g transform="translate({margin.left} {margin.top})">

		  <HoverEvents_UTxO
			width={innerWidth}
			height={innerHeight}
			{xScale}
			{xScaleZoom}
			{margin}
			{maxEpoch}
			bind:hoveredEpoch
			bind:isHovered
		  />
  
		  {#if totalShowDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoTotalData.delegated}
			color={DELEGATED_COLOR}
		  />
		{/if}

		{#if totalShowRPDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoTotalData.rp_delegated}
			color={RP_DELEGATED_COLOR}
		  />
		{/if}

		{#if totalShowNotDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoTotalData.not_delegated}
			color={NOT_DELEGATED_COLOR}
		  />
		{/if}

		{#if totalShowNeverDelegated === true}	
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoTotalData.never_delegated}
			color={NEVER_DELEGATED_COLOR}
		  />
		{/if}

		{#if totalShowCommercial === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoTotalData.commercial}
			color={COMMERCIAL_COLOR}
		  />
		{/if} 
		  

	
		</g>
	  {:else if $windowWidth <= 650}
	  <defs>
		<clipPath id="group-2">
		<rect x="0" y="0" width={innerWidthMobile} height={innerHeight} />
		</clipPath>
	</defs>
		
		<g transform="translate({marginMobile.left} {marginMobile.top})">
			<AxisX
			height={innerHeight}
			width={innerWidthMobile}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{hoveredEpoch}
			isUnhovered={isHovered === false}
		  />
		  <AxisY 
		  	width={innerWidthMobile}
			{yScale} 
			{yScaleZoom}
		  />

		</g>

		 
		<g clip-path="url(#group-2)" transform="translate({marginMobile.left} {marginMobile.top})">
  
		{#if totalShowDelegated === true}
			<Line
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.delegated}
				color={DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.delegated}
				color={DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		{/if}

		{#if totalShowRPDelegated === true}
			<Line
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.rp_delegated}
				color={RP_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.rp_delegated}
				color={RP_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		{/if}

		{#if totalShowNotDelegated === true}
			<Line
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.not_delegated}
				color={NOT_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.not_delegated}
				color={NOT_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		{/if}
		  
		{#if totalShowNeverDelegated === true}
			<Line
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.never_delegated}
				color={NEVER_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.never_delegated}
				color={NEVER_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		{/if}

		{#if totalShowCommercial === true}
			<Line
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.commercial}
				color={COMMERCIAL_COLOR}
				{hoveredEpoch}
			/>

			<Area
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoTotalData.commercial}
				color={COMMERCIAL_COLOR}
				{hoveredEpoch}
			/>
		{/if}
		  
		
		</g>

		<g transform="translate({marginMobile.left} {marginMobile.top})">

		  <HoverEvents_UTxO
		  	width={innerWidthMobile}
			height={innerHeight}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			margin={marginMobile}
			{maxEpoch}
			bind:hoveredEpoch
			bind:isHovered
		  />
  
		  {#if totalShowDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoTotalData.delegated}
			color={DELEGATED_COLOR}
		  />
		{/if}

		{#if totalShowRPDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoTotalData.rp_delegated}
			color={RP_DELEGATED_COLOR}
		  />
		{/if}

		{#if totalShowNotDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoTotalData.not_delegated}
			color={NOT_DELEGATED_COLOR}
		  />
		{/if}

		{#if totalShowNeverDelegated === true}	
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoTotalData.never_delegated}
			color={NEVER_DELEGATED_COLOR}
		  />
		{/if}

		{#if totalShowCommercial === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoTotalData.commercial}
			color={COMMERCIAL_COLOR}
		  />
		{/if} 
		  

	
		</g>
	  {/if}
	  </svg>
	
</section>



<style>
	.hero {
		margin-top: var(--spacing-16);
		margin-bottom: var(--spacing-128);
		padding: var(--spacing-24);
		
	}
	
	.heroheader {
		margin-top: var(--spacing-95);
		display: grid;
		
	}

	.heroheadertext {
		margin-top: 8px;
		margin-bottom: 8px;
		
		font-size: 20px;
		letter-spacing: .25px;
			
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
		box-shadow: var(--shadow-sm), 0 0 0 2px var(--clr-primary);
	}
	.chartdetail {
		gap: var(--spacing-16);
		padding: var(--spacing-18);
		

	}

	.button-container {
		margin-top: var(--spacing-16);
		margin-bottom: var(--spacing-16);
		display: grid;
		
		row-gap: var(--spacing-16);
		align-items: center;
		align-self: start;
		
	}

    
    .linechartdetailbuttons_delegated_active {
        display: flex;
        justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
        
		border: 1.5px solid var(--clr-menu-border);
        border-radius: 0;
        box-shadow: var(--shadow-sm), 0 0 0 2px var(--clr-primary);
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    }
    
    .linechartdetailbuttons_delegated {
        display: flex;
        justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
       
		border: 1.5px solid var(--clr-menu-border);
        border-radius: 0;
       
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    }

  
    .linechartdetailbuttons_delegated:focus {
       
        color: var(--clr-primary);
        box-shadow: 0 0 0 2px var(--clr-primary);

    }

    .linechartdetailbuttons_delegated:active {
        transition: box-shadow 0.07s ease;
        transform: scale(1.01);
        box-shadow: var(--shadow-sm), 0 0 0 2px var(--clr-primary);

    }

    .linechartdetailbuttons_rpdelegated_active {
        display: flex;
        justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
       
        border: 1.5px solid var(--clr-menu-border);
        border-radius: 0;
        box-shadow: var(--shadow-sm), 0 0 0 2px var(--clr-primary);
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    }

    .linechartdetailbuttons_rpdelegated {
        display: flex;
        justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
        
        border: 1.5px solid var(--clr-menu-border);
        border-radius: 0;
        
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    }

   

    .linechartdetailbuttons_rpdelegated:focus {
       
        color: var(--clr-primary);
        box-shadow: 0 0 0 2px var(--clr-primary);

    }

    .linechartdetailbuttons_rpdelegated:active {
        transition: box-shadow 0.07s ease;
        transform: scale(1.01);
        box-shadow: var(--shadow-md), 0 0 0 2px var(--clr-primary);

    }

    .linechartdetailbuttons_notdelegated_active {
        display: flex;
        justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
       
		border: 1.5px solid var(--clr-menu-border);
        border-radius: 0;
        box-shadow: var(--shadow-sm), 0 0 0 2px var(--clr-primary);
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    }

    .linechartdetailbuttons_notdelegated {
        display: flex;
        justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
        
        border-left: 1px solid var(--clr-menu-border);
        border: 1.5px solid var(--clr-menu-border);
        border-radius: 0;
        
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    }

   

    .linechartdetailbuttons_notdelegated:focus {
        
        color: var(--clr-primary);
        box-shadow: 0 0 0 2px var(--clr-primary);

    }

    .linechartdetailbuttons_notdelegated:active {
        transition: box-shadow 0.07s ease;
        transform: scale(1.01);
        box-shadow: var(--shadow-md), 0 0 0 2px var(--clr-primary);

    }

    .linechartdetailbuttons_neverdelegated_active {
        display: flex;
        justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
       
        border: 1.5px solid var(--clr-menu-border);
        border-radius: 0;
        box-shadow: var(--shadow-sm), 0 0 0 2px var(--clr-primary);
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    }

    .linechartdetailbuttons_neverdelegated {
        display: flex;
        justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
       
        border: 1.5px solid var(--clr-menu-border);
        border-radius: 0;
        
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    }

   

    .linechartdetailbuttons_neverdelegated:focus {
        
        color: var(--clr-primary);
        box-shadow: 0 0 0 2px var(--clr-primary);

    }

    .linechartdetailbuttons_neverdelegated:active {
        transition: box-shadow 0.07s ease;
        transform: scale(1.01);
        box-shadow: var(--shadow-md), 0 0 0 2px var(--clr-primary);

    }

	.linechartdetailbuttons_commercial_active {
        display: flex;
        justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
       
        border: 1.5px solid var(--clr-menu-border);
        border-radius: 0;
        box-shadow: var(--shadow-sm), 0 0 0 2px var(--clr-primary);
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    }

    .linechartdetailbuttons_commercial {
        display: flex;
        justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
       
        border: 1.5px solid var(--clr-menu-border);
        border-radius: 0;
       
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    }

   

    .linechartdetailbuttons_commercial:focus {
        
        color: var(--clr-primary);
        box-shadow: 0 0 0 2px var(--clr-primary);

    }

    .linechartdetailbuttons_commercial:active {
        transition: box-shadow 0.07s ease;
        transform: scale(1.01);
        box-shadow: var(--shadow-sm), 0 0 0 2px var(--clr-primary);

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
		
		.charttitle {
			
			grid-column: column-start 1 / span 12 ;
		}
		.chartdetail {
			
			grid-column: column-start 2 / span 10 ;
		}
		
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
            grid-column: column-start 1 / span 12 ;
        }
    
        .charttitle {
            
            grid-column: column-start 1 / span 12 ;
        }
        .chartdetail {
            
            grid-column: column-start 2 / span 10 ;
        }

        .button-container {
            display: grid;
            grid-template-columns: repeat(15, [column-start] 1fr);
            column-gap: var(--spacing-24);
        }

        .linechartdetailbuttons_delegated_active {
            grid-column: column-start 1 / span 3 ;
        }
        
        .linechartdetailbuttons_delegated {
            grid-column: column-start 1 / span 3 ;
        }

        .linechartdetailbuttons_rpdelegated_active {
            grid-column: column-start 4 / span 3 ;
        }

        .linechartdetailbuttons_rpdelegated {
            grid-column: column-start 4 / span 3 ;
        }

        .linechartdetailbuttons_notdelegated_active {
            grid-column: column-start 7 / span 3 ;
        }

        .linechartdetailbuttons_notdelegated {
            grid-column: column-start 7 / span 3 ;
        }

        .linechartdetailbuttons_neverdelegated_active {
            grid-column: column-start 10 / span 3 ;
        }

        .linechartdetailbuttons_neverdelegated {
            grid-column: column-start 10 / span 3 ;
        }

		.linechartdetailbuttons_commercial_active {
            grid-column: column-start 13 / span 3 ;
        }

        .linechartdetailbuttons_commercial {
            grid-column: column-start 13 / span 3 ;
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
        
        .chart-container {
            grid-column: column-start 1 / span 12 ;
        }
        .charttitle {
            
            grid-column: column-start 1 / span 12 ;
        }
        .chartdetail {
            
            grid-column: column-start 2 / span 10 ;
        }

		.button-container {
            display: grid;
            grid-template-columns: repeat(14, [column-start] 1fr);
            column-gap: var(--spacing-24);
        }

        .linechartdetailbuttons_delegated_active {
            grid-column: column-start 1 / span 7 ;
        }
        
        .linechartdetailbuttons_delegated {
            grid-column: column-start 1 / span 7 ;
        }

        .linechartdetailbuttons_rpdelegated_active {
            grid-column: column-start 8 / span 7 ;
        }

        .linechartdetailbuttons_rpdelegated {
            grid-column: column-start 8 / span 7 ;
        }

        .linechartdetailbuttons_notdelegated_active {
            grid-column: column-start 1 / span 7 ;
        }

        .linechartdetailbuttons_notdelegated {
            grid-column: column-start 1 / span 7 ;
        }

        .linechartdetailbuttons_neverdelegated_active {
            grid-column: column-start 8 / span 7 ;
        }

        .linechartdetailbuttons_neverdelegated {
            grid-column: column-start 8 / span 7 ;
        }

		.linechartdetailbuttons_commercial_active {
            grid-column: column-start 1 / span 7 ;
        }

        .linechartdetailbuttons_commercial {
            grid-column: column-start 1 / span 7 ;
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