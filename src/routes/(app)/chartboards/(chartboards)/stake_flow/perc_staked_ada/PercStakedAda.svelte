<script lang="ts">
  
    //*** imports ***//
    
    import debounceFn from "lodash.debounce";
    import { onMount } from "svelte";
    import { windowWidth, windowHeight, colorTheme } from '$lib/stores/mychart';
	import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
	import { fade, scale, slide } from 'svelte/transition';

	import {brushX} from "d3-brush";
    import { scaleLinear, scaleLog } from "d3-scale";
	import { line } from "d3-shape";
	import { select } from "d3-selection";
	import { zoom, zoomIdentity } from "d3-zoom";

    import AxisX from "./components/AxisX.svelte";
    import AxisY from "./components/AxisY.svelte";
	import HoverEvents_SF from "./components/HoverEvents.svelte";
	import Tooltip_SF from "./components/Tooltip.svelte";
	import LineColorVertGradient from "./components/LineColorVertGradient.svelte"

	
	//*** Data Import and Cleaning ***//
	export let delegationPrctData : any;

	console.log("delegationPrctData", delegationPrctData)
    
	const minEpoch = (delegationPrctData[0].epoch);
	const maxEpoch = (delegationPrctData[delegationPrctData.length - 1].epoch);
	let hoveredEpoch = maxEpoch;
	// const MAV_COLOR = "#FF6166";

	
	//*** Chart Params ***/

    const margin = { top: 15, right: 65, bottom: 55, left: 65};
	let height = 500;
	let width = 400;
	let innerHeight = height - margin.top - margin.bottom;

	let stakeFlowChart : any;

	$: innerWidth = width - margin.left - margin.right;

	// let currWindowWidth = $windowWidth;
    let debounce = 10000000000;

    const onResize = () => {
        $windowWidth = window.innerWidth;
        $windowHeight = Math.min(window.innerHeight,700);
        $colorTheme = localStorage.theme;

	};


	//*** Scaling ***//

    $: yScale = scaleLinear()
	  .domain([20, 80]) // INPUT ---- Y-Axis Limits ----
	  .range([innerHeight, 0]); // OUTPUT
	
	$: xScale = scaleLinear()
	  .domain([minEpoch, maxEpoch]) // INPUT
	  .range([10, innerWidth]); // OUTPUT


    const params = {
		delay: 100,
		duration: 750,
		easing: cubicOut
	  };

	const tData = tweened(delegationPrctData, params);
	  
	$: tData.set(delegationPrctData);

	//Zoom
    $: xScaleZoom = xScale;
	$: yScaleZoom = yScale;
	$: filteredPercData = delegationPrctData;

	onMount(() => {
        onResize();

		//scroll or pinch chart zoom
		const element = select(stakeFlowChart);
			element.call(
				zoom()
					.scaleExtent([1, 20])
					.extent([
						[0, 0],
						[innerWidth, innerHeight]
					])
					.translateExtent([
						[0, 0],
						[innerWidth, innerHeight]
					])
					.on("zoom", (event) => {

						xScaleZoom = event.transform.rescaleX(xScale);
						yScaleZoom = event.transform.rescaleY(yScale);

					}) 
					
			)

		/*--------- brushed x-axis range selection -------*/
		// const element = select(stakeFlowChart);
			element.append("g")
				.attr("class", "brush")
				.call(
					brushX()
						.extent([[65, 15], [width-65, height-55]])
						.on("brush end", brushed)
					)

			function brushed(event) {
				const selection = event.selection;
				if (selection === null) return;
				const [x0, x1] = selection.map(width-65, height-55);
				console.log("x0", x0)
				console.log("x1", x1)
				}

		console.log("element", element)

    });



	// console.log("svg", svg)


	//Chart Headings & Settings	
	let showContent = ''
	let chartTitle = 'Percent Staked Ada vs Total Circulating Ada Supply';
	let chartInfo = 'The Percent Staked Ada Chart provides how much Ada is historically staked (delegation and pledge) versus the total circulating supply of Ada.  Large changes of Ada Staked represent significant Stake Flow and is important to pay attention to for the security of the network.';

	const handleClick = (payload : any) => {
  
		showContent = payload === showContent ? '' : payload
	}
	
	const handleQAClose = () => {
		showContent = ''
		
	}


</script>

<svelte:window
  on:load={onResize}
  on:resize={debounceFn(onResize, debounce)}
  />

  <section class="heroheader">
	<button class="charttitle" type="button" on:click={() => handleClick(chartTitle)}><h4 class="heroheadertext" >{chartTitle}</h4></button>
		{#if showContent === chartTitle}
			<p class="chartdetail" transition:slide={{ duration: 200 }}>
				{chartInfo}
			</p>
		{/if}
  </section>

  <section class="hero">
    <div class='chart-container' bind:clientWidth={width}>
	<svg bind:this={stakeFlowChart} {width}	{height} aria-labelledby="chart-title" aria-describedby="chart-description" role="img">

		<defs>
			<clipPath id="group-1">
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
				isUnhovered={hoveredEpoch === maxEpoch}
			/>

			<AxisY 
				width={innerWidth} 
				{yScale} 
				{yScaleZoom}
			/>
		</g>

		<g clip-path="url(#group-1)" transform="translate({margin.left} {margin.top})">
			<LineColorVertGradient
				data={delegationPrctData}
				{xScale}
				{yScale}
				{xScaleZoom}
				{yScaleZoom}
				{hoveredEpoch}
			/>		 
		</g>

		<g transform="translate({margin.left} {margin.top})">

			<HoverEvents_SF
				width={innerWidth}
				height={innerHeight}
				{xScale}
				{xScaleZoom}
				{margin}
				{maxEpoch}
				bind:hoveredEpoch
			/>
		
		    <Tooltip_SF
				{hoveredEpoch}
				{xScale}
				{xScaleZoom}
				{yScale}
				{yScaleZoom}
				data={delegationPrctData}
			/>
		</g>
	</svg>
	
</section>



<style>
	.hero {
		margin-top: var(--spacing-24);
		margin-bottom: var(--spacing-24);
		padding: var(--spacing-24);
		
	}
	
	.heroheader {
		margin-top: var(--spacing-24);
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

    
    }
  </style>