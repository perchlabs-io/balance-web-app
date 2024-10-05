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
    //import Area from "./components/Area.svelte";
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
	const marginMobile = { top: 15, right: 55, bottom: 55, left: 40 };
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

    

	let deltaMax : any;
	let deltaMin : any;
	let deltaHighArray : any;
	let deltaLowArray : any;

	let deltaHighDelegated : any;
	let deltaHighRPDelegated : any;
	let deltaHighNotDelegated : any;
	let deltaHighNeverDelegated : any;
	let deltaHighCommercial : any;

	let deltaLowDelegated : any;
	let deltaLowRPDelegated : any;
	let deltaLowNotDelegated : any;
	let deltaLowNeverDelegated : any;
	let deltaLowCommercial : any;
	
	let deltaShowDelegated = true;
	let deltaShowRPDelegated = true;
	let deltaShowNotDelegated = true;
	let deltaShowNeverDelegated = true;
	let deltaShowCommercial = true;



    $: yScale = scaleLinear()
	  .domain([deltaMin, deltaMax]) // INPUT
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

	
	export let utxoDeltaData : any;

	

	

	const params = {
		delay: 100,
		duration: 750,
		easing: cubicOut
	  };

	const tData = tweened(utxoDeltaData, params);
	  
	$: tData.set(utxoDeltaData);

	
    $: xScaleZoom = xScale;
	$: xScaleZoomMobile = xScaleMobile;
	$: yScaleZoom = yScale;
    

	onMount(() => {
        onResize();

		

	const element = select(utxoChart);
		element.call(
			zoom()
				.scaleExtent([1, 120])
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
	
	
	deltaHighDelegated = Math.max(...$tData['delegated'].map((o : any) => o.delta))
	deltaHighRPDelegated = Math.max(...$tData['rp_delegated'].map((o : any) => o.delta))
	deltaHighNotDelegated = Math.max(...$tData['not_delegated'].map((o : any) => o.delta))
	deltaHighNeverDelegated = Math.max(...$tData['never_delegated'].map((o : any) => o.delta))
	deltaHighCommercial = Math.max(...$tData['commercial'].map((o : any) => o.delta))

	deltaLowDelegated = Math.min(...$tData['delegated'].map((o : any) => o.delta))
	deltaLowRPDelegated = Math.min(...$tData['rp_delegated'].map((o : any) => o.delta))
	deltaLowNotDelegated = Math.min(...$tData['not_delegated'].map((o : any) => o.delta))
	deltaLowNeverDelegated = Math.min(...$tData['never_delegated'].map((o : any) => o.delta))
	deltaLowCommercial = Math.min(...$tData['commercial'].map((o : any) => o.delta))

	$: deltaHighArray = 
				[
					{'category':'delegated', 'delta': deltaHighDelegated},
					{'category':'rp_delegated', 'delta': deltaHighRPDelegated},
					{'category':'not_delegated', 'delta': deltaHighNotDelegated},
					{'category':'never_delegated', 'delta': deltaHighNeverDelegated},
					{'category':'commercial', 'delta': deltaHighCommercial}
				]

	$: deltaLowArray = 
				[
					{'category':'delegated', 'delta': deltaLowDelegated},
					{'category':'rp_delegated', 'delta': deltaLowRPDelegated},
					{'category':'not_delegated', 'delta': deltaLowNotDelegated},
					{'category':'never_delegated', 'delta': deltaLowNeverDelegated},
					{'category':'commercial', 'delta': deltaLowCommercial}
				]

	

	let deltaMaxBase : any;
	let deltaMinBase : any;

	$: deltaMaxBase = Math.max(...deltaHighArray.map((o : any) => o.delta))
	$: deltaMax = deltaMaxBase + (deltaMaxBase * .10)

	$: deltaMinBase = Math.min(...deltaLowArray.map((o : any) => o.delta))
	$: deltaMin = deltaMinBase + (deltaMinBase * .10)

	let showContent = ''
	let chartTitle = 'UTxO Allocation Delta Per Category';
	let chartInfo = 'The UTxO Allocation Delta chart provides historical UTxO allocation net change detail per selected categories.  Identify potenital correlations in UTxO alloction fluctuations by selecting multiple categories to explore.';

	

	const handleClick = (payload : any) => {
  
		showContent = payload === showContent ? '' : payload
	}

	const showDelegated = () => {

		let deltaHighDelegatedArray : any;
		let deltaLowDelegatedArray : any;
		let workHighArray : any;
		let workLowArray : any;

		const arrayLength = deltaHighArray.length
		
		if (deltaShowDelegated != false && arrayLength > 1) {


			deltaHighDelegatedArray = [];
			workHighArray = [];
			deltaLowDelegatedArray = [];
			workLowArray = [];
			workHighArray = deltaHighArray;
			workLowArray = deltaLowArray;

			const indexHigh = workHighArray.map((i : any) => i.category).indexOf('delegated');
			deltaHighDelegatedArray = workHighArray.splice(indexHigh, 1)
			deltaMaxBase = Math.max(...workHighArray.map((o : any) => o.delta))
			deltaMax = deltaMaxBase + (deltaMaxBase * .10)
			const indexLow = workLowArray.map((i : any) => i.category).indexOf('delegated');
			deltaLowDelegatedArray = workLowArray.splice(indexLow, 1)
			deltaMinBase = Math.min(...workLowArray.map((o : any) => o.delta))
			deltaMin = deltaMinBase + (deltaMinBase * .10)
			deltaHighArray = workHighArray
			deltaLowArray = workLowArray
			deltaShowDelegated = false;

			const element = select(utxoChart);
				element.call(
					zoom()
						.transform, zoomIdentity
			
				)

			xScaleZoom = xScale;
			xScaleZoomMobile = xScaleMobile;
			yScaleZoom = yScale;


		} else if (deltaShowDelegated == false && arrayLength >= 1) {

			deltaHighArray = deltaHighArray.concat({'category':'delegated', 'delta': deltaHighDelegated});
			deltaMaxBase = Math.max(...deltaHighArray.map((o : any) => o.delta))
			deltaMax = deltaMaxBase + (deltaMaxBase * .10)
			deltaLowArray = deltaLowArray.concat({'category':'delegated', 'delta': deltaLowDelegated});
			deltaMinBase = Math.min(...deltaLowArray.map((o : any) => o.delta))
			deltaMin = deltaMinBase + (deltaMinBase * .10)
			deltaShowDelegated = true;

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

		let deltaHighRPDelegatedArray : any;
		let deltaLowRPDelegatedArray : any;
		let workHighArray : any;
		let workLowArray : any;
		
		const arrayLength = deltaHighArray.length

		if (deltaShowRPDelegated != false && arrayLength > 1) {

			deltaHighRPDelegatedArray = [];
			workHighArray = [];
			deltaLowRPDelegatedArray = [];
			workLowArray = [];
			workHighArray = deltaHighArray;
			workLowArray = deltaLowArray;

			const indexHigh = deltaHighArray.map((i : any) => i.category).indexOf('rp_delegated');
			deltaHighRPDelegatedArray = workHighArray.splice(indexHigh, 1)
			deltaMaxBase = Math.max(...workHighArray.map((o : any) => o.delta))
			deltaMax = deltaMaxBase + (deltaMaxBase * .10)
			const indexLow = workLowArray.map((i : any) => i.category).indexOf('rp_delegated');
			deltaLowRPDelegatedArray = workLowArray.splice(indexLow, 1)
			deltaMinBase = Math.min(...workLowArray.map((o : any) => o.delta))
			deltaMin = deltaMinBase + (deltaMinBase * .10)
			deltaHighArray = workHighArray
			deltaLowArray = workLowArray
			deltaShowRPDelegated = false;

			const element = select(utxoChart);
				element.call(
					zoom()
						.transform, zoomIdentity
			
				)

			xScaleZoom = xScale;
			xScaleZoomMobile = xScaleMobile;
			yScaleZoom = yScale;


		} else if (deltaShowRPDelegated == false && arrayLength >= 1) {

		
			deltaHighArray = deltaHighArray.concat({'category':'rp_delegated', 'delta': deltaHighRPDelegated});
			deltaMaxBase = Math.max(...deltaHighArray.map((o : any) => o.delta))
			deltaMax = deltaMaxBase + (deltaMaxBase * .10)
			deltaLowArray = deltaLowArray.concat({'category':'rp_delegated', 'delta': deltaLowRPDelegated});
			deltaMinBase = Math.min(...deltaLowArray.map((o : any) => o.delta))
			deltaMin = deltaMinBase + (deltaMinBase * .10)
			deltaShowRPDelegated = true;

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

		let deltaHighNotDelegatedArray : any;
		let deltaLowNotDelegatedArray : any;
		let workHighArray : any;
		let workLowArray : any;

		const arrayLength = deltaHighArray.length
	
		if (deltaShowNotDelegated != false && arrayLength > 1) {

			deltaHighNotDelegatedArray = [];
			workHighArray = [];
			deltaLowNotDelegatedArray = [];
			workLowArray = [];
			workHighArray = deltaHighArray;
			workLowArray = deltaLowArray;

			const indexHigh = deltaHighArray.map((i : any) => i.category).indexOf('not_delegated');
			deltaHighNotDelegatedArray = workHighArray.splice(indexHigh, 1)
			deltaMaxBase = Math.max(...workHighArray.map((o : any) => o.delta))
			deltaMax = deltaMaxBase + (deltaMaxBase * .10)
			const indexLow = workLowArray.map((i : any) => i.category).indexOf('not_delegated');
			deltaLowNotDelegatedArray = workLowArray.splice(indexLow, 1)
			deltaMinBase = Math.min(...workLowArray.map((o : any) => o.delta))
			deltaMin = deltaMinBase + (deltaMinBase * .10)
			deltaHighArray = workHighArray
			deltaLowArray = workLowArray
			deltaShowNotDelegated = false;

			const element = select(utxoChart);
				element.call(
					zoom()
						.transform, zoomIdentity
			
				)

			xScaleZoom = xScale;
			xScaleZoomMobile = xScaleMobile;
			yScaleZoom = yScale;

		} else if (deltaShowNotDelegated == false && arrayLength >= 1) {

			deltaHighArray = deltaHighArray.concat({'category':'not_delegated', 'delta': deltaHighNotDelegated});
			deltaMaxBase = Math.max(...deltaHighArray.map((o : any) => o.delta))
			deltaMax = deltaMaxBase + (deltaMaxBase * .10)
			deltaLowArray = deltaLowArray.concat({'category':'not_delegated', 'delta': deltaLowNotDelegated});
			deltaMinBase = Math.min(...deltaLowArray.map((o : any) => o.delta))
			deltaMin = deltaMinBase + (deltaMinBase * .10)
			deltaShowNotDelegated = true;

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

	
		let deltaHighNeverDelegatedArray : any;
		let deltaLowNeverDelegatedArray : any;
		let workHighArray : any;
		let workLowArray : any;

		const arrayLength = deltaHighArray.length
	
		if (deltaShowNeverDelegated != false && arrayLength > 1) {

			deltaHighNeverDelegatedArray = [];
			workHighArray = [];
			deltaLowNeverDelegatedArray = [];
			workLowArray = [];
			workHighArray = deltaHighArray;
			workLowArray = deltaLowArray;

			const indexHigh = workHighArray.map((i : any) => i.category).indexOf('never_delegated');
			deltaHighNeverDelegatedArray = workHighArray.splice(indexHigh, 1)
			deltaMaxBase = Math.max(...workHighArray.map((o : any) => o.delta))
			deltaMax = deltaMaxBase + (deltaMaxBase * .10)
			const indexLow = workLowArray.map((i : any) => i.category).indexOf('never_delegated');
			deltaLowNeverDelegatedArray = workLowArray.splice(indexLow, 1)
			deltaMinBase = Math.min(...workLowArray.map((o : any) => o.delta))
			deltaMin = deltaMinBase + (deltaMinBase * .10)
			deltaHighArray = workHighArray
			deltaLowArray = workLowArray
			deltaShowNeverDelegated = false;

			const element = select(utxoChart);
				element.call(
					zoom()
						.transform, zoomIdentity
			
				)

			xScaleZoom = xScale;
			xScaleZoomMobile = xScaleMobile;
			yScaleZoom = yScale;

		} else if (deltaShowNeverDelegated == false && arrayLength >= 1) {

			deltaHighArray = deltaHighArray.concat({'category':'never_delegated', 'delta': deltaHighNeverDelegated});
			deltaMaxBase = Math.max(...deltaHighArray.map((o : any) => o.delta))
			deltaMax = deltaMaxBase + (deltaMaxBase * .10)
			deltaLowArray = deltaLowArray.concat({'category':'never_delegated', 'delta': deltaLowNeverDelegated});
			deltaMinBase = Math.min(...deltaLowArray.map((o : any) => o.delta))
			deltaMin = deltaMinBase + (deltaMinBase * .10)
			deltaShowNeverDelegated = true;

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

		let deltaHighCommercialArray : any;
		let deltaLowCommercialArray : any;
		let workHighArray : any;
		let workLowArray : any;

		const arrayLength = deltaHighArray.length

		
	
		if (deltaShowCommercial != false && arrayLength > 1) {


			deltaHighCommercialArray = [];
			workHighArray = [];
			deltaLowCommercialArray = [];
			workLowArray = [];
			workHighArray = deltaHighArray;
			workLowArray = deltaLowArray;

			const indexHigh = deltaHighArray.map((i : any) => i.category).indexOf('commercial');
			deltaHighCommercialArray = workHighArray.splice(indexHigh, 1)
			deltaMaxBase = Math.max(...workHighArray.map((o : any) => o.delta))
			deltaMax = deltaMaxBase + (deltaMaxBase * .10)
			const indexLow = workLowArray.map((i : any) => i.category).indexOf('commercial');
			deltaLowCommercialArray = workLowArray.splice(indexLow, 1)
			deltaMinBase = Math.min(...workLowArray.map((o : any) => o.delta))
			deltaMin = deltaMinBase + (deltaMinBase * .10)
			deltaHighArray = workHighArray
			deltaLowArray = workLowArray
			deltaShowCommercial = false;

			const element = select(utxoChart);
				element.call(
					zoom()
						.transform, zoomIdentity
			
				)

			xScaleZoom = xScale;
			xScaleZoomMobile = xScaleMobile;
			yScaleZoom = yScale;

			
		} else if (deltaShowCommercial == false && arrayLength >= 1) {

			deltaHighArray = deltaHighArray.concat({'category':'commercial', 'delta': deltaHighCommercial});
			deltaMaxBase = Math.max(...deltaHighArray.map((o : any) => o.delta))
			deltaMax = deltaMaxBase + (deltaMaxBase * .10)
			deltaLowArray = deltaLowArray.concat({'category':'commercial', 'delta': deltaLowCommercial});
			deltaMinBase = Math.min(...deltaLowArray.map((o : any) => o.delta))
			deltaMin = deltaMinBase + (deltaMinBase * .10)
			deltaShowCommercial = true;

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
	
    {#if deltaShowDelegated === true}
        <button class="linechartdetailbuttons_delegated_active" type="button" on:click={() => showDelegated()}><h4>Delegated</h4><Icon icon="fa:pie-chart" style="color:{DELEGATED_COLOR}"  width="17" /></button>
    {:else}
        <button class="linechartdetailbuttons_delegated" type="button" on:click={() => showDelegated()}><h4>Delegated</h4><Icon icon="fa:pie-chart" style="color:{DELEGATED_COLOR}"  width="17" /></button>
    {/if}

    {#if deltaShowRPDelegated === true}
        <button class="linechartdetailbuttons_rpdelegated_active" type="button" on:click={() => showRPDelegated()}><h4>Retired Pool</h4><Icon icon="fa:pie-chart" style="color:{RP_DELEGATED_COLOR}"  width="17" /></button>
    {:else}
        <button class="linechartdetailbuttons_rpdelegated" type="button" on:click={() => showRPDelegated()}><h4>Retired Pool</h4><Icon icon="fa:pie-chart" style="color:{RP_DELEGATED_COLOR}"  width="17" /></button>
    {/if}

    {#if deltaShowNotDelegated === true}
        <button class="linechartdetailbuttons_notdelegated_active"type="button" on:click={() => showNotDelegated()}><h4>Not Delegated</h4><Icon icon="fa:pie-chart" style="color:{NOT_DELEGATED_COLOR}"  width="17" /></button>
    {:else}
        <button class="linechartdetailbuttons_notdelegated" type="button" on:click={() => showNotDelegated()}><h4>Not Delegated</h4><Icon icon="fa:pie-chart" style="color:{NOT_DELEGATED_COLOR}"  width="17" /></button>
    {/if}

    {#if deltaShowNeverDelegated === true}
        <button class="linechartdetailbuttons_neverdelegated_active" type="button" on:click={() => showNeverDelegated()}><h4>Never Delegated</h4><Icon icon="fa:pie-chart" style="color:{NEVER_DELEGATED_COLOR}"  width="17" /></button>
    {:else}
        <button class="linechartdetailbuttons_neverdelegated" type="button" on:click={() => showNeverDelegated()}><h4>Never Delegated</h4><Icon icon="fa:pie-chart" style="color:{NEVER_DELEGATED_COLOR}"  width="17" /></button>
    {/if}

	{#if deltaShowCommercial === true}
        <button class="linechartdetailbuttons_commercial_active" type="button" on:click={() => showCommercial()}><h4>Ineligible</h4><Icon icon="fa:pie-chart" style="color:{COMMERCIAL_COLOR}"  width="17" /></button>
    {:else}
        <button class="linechartdetailbuttons_commercial" type="button" on:click={() => showCommercial()}><h4>Ineligible</h4><Icon icon="fa:pie-chart"style="color:{COMMERCIAL_COLOR}"  width="17" /></button>
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

		{#if deltaShowDelegated === true}
		  <Line
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.delegated}
			color={DELEGATED_COLOR}
			{hoveredEpoch}
		  />
		{/if}
		  
		{#if deltaShowRPDelegated === true}
		  <Line
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.rp_delegated}
			color={RP_DELEGATED_COLOR}
			{hoveredEpoch}
		  />
		{/if}  
		
		{#if deltaShowNotDelegated === true}
		  <Line
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.not_delegated}
			color={NOT_DELEGATED_COLOR}
			{hoveredEpoch}
		  />
		{/if}


		{#if deltaShowNeverDelegated === true}
		  <Line
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.never_delegated}
			color={NEVER_DELEGATED_COLOR}
			{hoveredEpoch}
		  />
		{/if}  

		{#if deltaShowCommercial === true}
		  <Line
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.commercial}
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
		
		  {#if deltaShowDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.delegated}
			color={DELEGATED_COLOR}
		  />
		{/if}

		{#if deltaShowRPDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.rp_delegated}
			color={RP_DELEGATED_COLOR}
		  />
		{/if}

		{#if deltaShowNotDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.not_delegated}
			color={NOT_DELEGATED_COLOR}
		  />
		{/if}

		{#if deltaShowNeverDelegated === true}	
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.never_delegated}
			color={NEVER_DELEGATED_COLOR}
		  />
		{/if}

		{#if deltaShowCommercial === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			{xScale}
			{xScaleZoom}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.commercial}
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

		{#if deltaShowDelegated === true}
		  <Line
		  	xScale={xScaleMobile}
		  	xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.delegated}
			color={DELEGATED_COLOR}
			{hoveredEpoch}
		  />
		{/if}
		  
		{#if deltaShowRPDelegated === true}
		  <Line
		  	xScale={xScaleMobile}
		  	xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.rp_delegated}
			color={RP_DELEGATED_COLOR}
			{hoveredEpoch}
		  />
		{/if}  
		
		{#if deltaShowNotDelegated === true}
		  <Line
		  	xScale={xScaleMobile}
		  	xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.not_delegated}
			color={NOT_DELEGATED_COLOR}
			{hoveredEpoch}
		  />
		{/if}


		{#if deltaShowNeverDelegated === true}
		  <Line
		  	xScale={xScaleMobile}
		  	xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.never_delegated}
			color={NEVER_DELEGATED_COLOR}
			{hoveredEpoch}
		  />
		{/if}  

		{#if deltaShowCommercial === true}
		  <Line
		  	xScale={xScaleMobile}
		  	xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.commercial}
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
		
		  {#if deltaShowDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
		  	xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.delegated}
			color={DELEGATED_COLOR}
		  />
		{/if}

		{#if deltaShowRPDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
		  	xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.rp_delegated}
			color={RP_DELEGATED_COLOR}
		  />
		{/if}

		{#if deltaShowNotDelegated === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
		  	xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.not_delegated}
			color={NOT_DELEGATED_COLOR}
		  />
		{/if}

		{#if deltaShowNeverDelegated === true}	
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
		  	xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.never_delegated}
			color={NEVER_DELEGATED_COLOR}
		  />
		{/if}

		{#if deltaShowCommercial === true}
		  <Tooltip_UTxO
			{hoveredEpoch}
			xScale={xScaleMobile}
		  	xScaleZoom={xScaleZoomMobile}
			{yScale}
			{yScaleZoom}
			data={utxoDeltaData.commercial}
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
		margin-bottom: var(--spacing-98);
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
		margin-bottom: var(--spacing-18);
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
        box-shadow: var(--shadow-md), 0 0 0 2px var(--clr-primary);

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
        box-shadow: var(--shadow-md), 0 0 0 2px var(--clr-primary);

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

    
    }
  </style>
  