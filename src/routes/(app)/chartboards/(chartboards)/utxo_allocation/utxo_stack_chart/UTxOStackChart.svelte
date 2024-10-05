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
	import Icon from '@iconify/svelte';
	

    
    export let epochData : any;

    const margin = { top: 15, right: 65, bottom: 55, left: 65 };
	const marginMobile = { top: 15, right: 50, bottom: 55, left: 40 };
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

	let stackMax : any;
	

	let stackHighDelegated : any;
	let stackHighRPDelegated : any;
	let stackHighNotDelegated : any;
	let stackHighNeverDelegated : any;
	let stackHighCommercial : any;
	
	
    

    $: yScale = scaleLinear()
	  .domain([0, stackMax]) // INPUT
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

	export let utxoStackData : any;

    const params = {
		delay: 100,
		duration: 750,
		easing: cubicOut
	  };

	const tData = tweened(utxoStackData, params);
	  
	$: tData.set(utxoStackData);

	
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

	stackHighDelegated = Math.max(...$tData['delegated'].map((o : any) => o.high))
	stackHighRPDelegated = Math.max(...$tData['rp_delegated'].map((o : any) => o.high))
	stackHighNotDelegated = Math.max(...$tData['not_delegated'].map((o : any) => o.high))
	stackHighNeverDelegated = Math.max(...$tData['never_delegated'].map((o : any) => o.high))
	stackHighCommercial = Math.max(...$tData['commercial'].map((o : any) => o.high))

	
	let stackMaxBase : any;
	

	$: stackMaxBase = stackHighDelegated
	$: stackMax = stackMaxBase + (stackMaxBase * .10)

	let showContent = ''
	let chartTitle = 'Aggregate UTxO Stack';
	let chartInfo = 'The Aggregate UTxO Stack chart provides a cumulative view of the 5 UTxO categories, supporting compare and contrast of each category ADA allocation against total ADA supply in circulation.';
	let catDelegatedInfo = 'ADA delegated to stake pool'
	let catRPDelegatedInfo = 'ADA delegated to retired stake pool'
	let catNotDelegatedInfo = 'ADA residing in wallet with prior delegation history, but not delegated.'
	let catNeverDelegatedInfo = 'ADA residing in wallet with no delegation history.'
	let catCommercialInfo = 'ADA residing in wallet without registered stake address.'

	const handleClick = (payload : any) => {
  
		showContent = payload === showContent ? '' : payload
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
		{chartInfo}<br/><br/>
		
			<b>Delegated:&emsp;</b>{catDelegatedInfo}<br/>
			<b>Retired Pool:&emsp;</b>{catRPDelegatedInfo}<br/>
			<b>Not Delegated:&emsp;</b>{catNotDelegatedInfo}<br/>
			<b>Never Delegated:&emsp;</b>{catNeverDelegatedInfo}<br/>
			<b>Ineligible:&emsp;</b>{catCommercialInfo}<br/>
		
	</p>
	
	
	{/if}
  </section>

  <section class="inputbox" >
	<div class="legendDelegated">
		<h4>Delegated</h4><Icon icon="fa:pie-chart" style="color:{DELEGATED_COLOR}"  width="17" />
		
	</div>
	<div class="legendRPDelegated">
		<h4>Retired Pool</h4><Icon icon="fa:pie-chart" style="color:{RP_DELEGATED_COLOR}"  width="17" />
	</div>
	<div class="legendNotDelegated">
		<h4>Not Delegated</h4><Icon icon="fa:pie-chart"style="color:{NOT_DELEGATED_COLOR}"  width="17" />
	</div>
	<div class="legendNeverDelegated">
		<h4>Never Delegated</h4><Icon icon="fa:pie-chart" style="color:{NEVER_DELEGATED_COLOR}"  width="17" />
	</div>
	<div class="legendCommercial">
		<h4>Ineligible</h4><Icon icon="fa:pie-chart" style="color:{COMMERCIAL_COLOR}"  width="17" />
	</div>

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
  
		
			<Line
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.delegated}
				color={DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.delegated}
				color={DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		

		
			<Line
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.rp_delegated}
				color={RP_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.rp_delegated}
				color={RP_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		

		
			<Line
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.not_delegated}
				color={NOT_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.not_delegated}
				color={NOT_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		
		  
		
			<Line
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.never_delegated}
				color={NEVER_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.never_delegated}
				color={NEVER_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		

		
			<Line
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.commercial}
				color={COMMERCIAL_COLOR}
				{hoveredEpoch}
			/>

			<Area
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.commercial}
				color={COMMERCIAL_COLOR}
				{hoveredEpoch}
			/>
		
		  
		
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
  
		  
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoStackData.delegated}
			color={DELEGATED_COLOR}
		  />
		

		
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoStackData.rp_delegated}
			color={RP_DELEGATED_COLOR}
		  />
		

		
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoStackData.not_delegated}
			color={NOT_DELEGATED_COLOR}
		  />
		

		
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoStackData.never_delegated}
			color={NEVER_DELEGATED_COLOR}
		  />
		

		
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoStackData.commercial}
			color={COMMERCIAL_COLOR}
		  />
		
		  

	
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
  
		
			<Line
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.delegated}
				color={DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.delegated}
				color={DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		

		
			<Line
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.rp_delegated}
				color={RP_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.rp_delegated}
				color={RP_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		

		
			<Line
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.not_delegated}
				color={NOT_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.not_delegated}
				color={NOT_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		
		  
		
			<Line
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.never_delegated}
				color={NEVER_DELEGATED_COLOR}
				{hoveredEpoch}
			/>

			<Area
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.never_delegated}
				color={NEVER_DELEGATED_COLOR}
				{hoveredEpoch}
			/>
		

		
			<Line
				xScale={xScaleMobile}
				xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.commercial}
				color={COMMERCIAL_COLOR}
				{hoveredEpoch}
			/>

			<Area
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
				{yScale}
				{yScaleZoom}
				data={utxoStackData.commercial}
				color={COMMERCIAL_COLOR}
				{hoveredEpoch}
			/>
		
		  
		
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
  
		  
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoStackData.delegated}
			color={DELEGATED_COLOR}
		  />
		

		
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoStackData.rp_delegated}
			color={RP_DELEGATED_COLOR}
		  />
		

		
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoStackData.not_delegated}
			color={NOT_DELEGATED_COLOR}
		  />
		

		
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoStackData.never_delegated}
			color={NEVER_DELEGATED_COLOR}
		  />
		

		
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
			xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoStackData.commercial}
			color={COMMERCIAL_COLOR}
		  />
		
		  

	
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
	.inputbox {
		margin-top: var(--spacing-16);
		display: grid;
		row-gap: var(--spacing-16);
		align-items: center;
		align-self: start;
		
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

	.legendDelegated {
		display: flex;
		justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		align-items: center;
		

	}
	.legendRPDelegated {
		display: flex;
		justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		align-items: center;
		

	}
	.legendNotDelegated {
		display: flex;
		justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		align-items: center;
		

	}
	.legendNeverDelegated {
		display: flex;
		justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		align-items: center;
		

	}
	.legendCommercial {
		display: flex;
		justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		align-items: center;
		

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
		border-radius:0;
		
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

		.inputbox {
			display: grid;
			grid-template-columns: repeat(15, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}
		.legendDelegated {
			grid-column: column-start 1 / span 3 ;

		}
		.legendRPDelegated {
			grid-column: column-start 4 / span 3 ;

		}
		.legendNotDelegated {
			grid-column: column-start 7 / span 3 ;

		}
		.legendNeverDelegated {
			grid-column: column-start 10 / span 3 ;

		}
		.legendCommercial {
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

		.inputbox {
			display: grid;
			grid-template-columns: repeat(14, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}
		.legendDelegated {
			grid-column: column-start 1 / span 7 ;

		}
		.legendRPDelegated {
			grid-column: column-start 8 / span 7 ;

		}
		.legendNotDelegated {
			grid-column: column-start 1 / span 7 ;

		}
		.legendNeverDelegated {
			grid-column: column-start 8 / span 7 ;

		}
		.legendCommercial {
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