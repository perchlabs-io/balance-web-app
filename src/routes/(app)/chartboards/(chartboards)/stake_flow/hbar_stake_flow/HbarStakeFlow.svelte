<script lang="ts">
  
    //*** imports ***//
	import Tooltip from "./components/Tooltip.svelte";

    import debounceFn from "lodash.debounce";
    import { onMount } from "svelte";
    import { windowWidth, windowHeight, colorTheme } from '$lib/stores/mychart';
	import { fade, scale, slide } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

	import {brushX} from "d3-brush";
    import { scaleLinear, scaleLog } from "d3-scale";
	import { select } from "d3-selection";
	import { zoom, zoomIdentity } from "d3-zoom";
	import { empty } from "svelte/internal"

	//*** Data Import and Cleaning ****//
	export let stakeFlowData: any;
	export let delegationPrctData : any;
    
	const minEpoch = (delegationPrctData[0].epoch);
	const maxEpoch = (delegationPrctData[delegationPrctData.length - 1].epoch);
	let hoveredEpoch = maxEpoch;
	let hoveredDataIn = false;
	let hoveredDataOut = false;
	let hoveredStateIn = false;
	let hoveredStateOut = false;
	let hoveredIndexIn = null;
	let hoveredIndexOut = null;
    // console.log("maxEpoch",maxEpoch)
	// number for hbars
	const numOfHBars = 50;

	const params = {
		delay: 100,
		duration: 750,
		easing: cubicOut
	  };

	const tData = tweened(stakeFlowData, params);
	$: tData.set(stakeFlowData);
	// console.log("tData",tData)

	// Get the latest epoch index key
	const keys = Object.keys(stakeFlowData).map(key => parseInt(key)).filter(key => !isNaN(key));
	const latestEpochKey = Math.max(...keys);
	let latestEpochData = stakeFlowData[latestEpochKey]
	// console.log(`The largest key index: ${latestEpochKey}`);
	// console.log('latestEpochData',stakeFlowData[latestEpochKey])



	// Finding top 25 winners
	let top_in_flow = [...latestEpochData] // create a shallow copy to not mutate the original array
		.sort((a, b) => b.stakedelta - a.stakedelta) // sort by stakedelta descending
		.slice(0, numOfHBars); // take the first 25

	// Finding top 25 losers
	let top_out_flow = [...latestEpochData] // create a shallow copy to not mutate the original array
		.sort((a, b) => a.stakedelta - b.stakedelta) // sort by stakedelta ascending
		.slice(0, numOfHBars); // take the first 25

	// console.log(`The largest key index: ${latestEpochKey}`);
	// console.log('Last element of stakeFlowData', lastElementArray);
	console.log('Top IN Flow:', top_in_flow);
	// console.log('Top OUT Flow:', top_out_flow);

	// Assuming latestEpochData is an array of objects and each object has a stakedelta property
	// Map each element to its absolute stakedelta value
	const absoluteStakeDeltas = latestEpochData.map(data => Math.abs(data.stakedelta));

	// Find the maximum value among the absolute stakedelta values
	let maxStakeDelta = Math.max(...absoluteStakeDeltas);

	console.log('max absolute stake delta this epoch:', maxStakeDelta);



	//*** Chart Params ***/
    const margin = { top: 15, right: 65, bottom: 55, left: 65};
	let height = 1000;
	// let width = 400;
	let width = 400; //Looking to have the window width split
	let innerHeight = height - margin.top - margin.bottom;

	let stakeFlowChart : any;

	$: innerWidth = width - margin.left - margin.right;

	let currWindowWidth = $windowWidth;
    let debounce = 10000000000;

    const onResize = () => {
        $windowWidth = window.innerWidth;
        // $windowHeight = Math.min(window.innerHeight,700);
		$windowHeight = Math.max(window.innerHeight,700);
        $colorTheme = localStorage.theme;

	};

	//*** Scaling ***/ 
 	$: yScale = scaleLinear()
	  .domain([numOfHBars-1, 0])		// INPUT: index of bars
	  .range([innerHeight, 0]); 		// OUTPUT
	
	$: xScale = scaleLinear()
	  .domain([0, maxStakeDelta]) 		// INPUT
	  .range([0, innerWidth/2]); 		// OUTPUT

	$: xScaleOut = scaleLinear()
	  .domain([-maxStakeDelta,0]) 	 	// INPUT
	  .range([0, innerWidth/2]); 		// OUTPUT

	//"hsla(128, 66%, 57%, 1)" //bright dark green used in donut charts
	//"hsla(0, 99%, 63%, 1)"   //bright dark red used in donut charts

	$: colorScale = scaleLinear()
		.domain([0, numOfHBars - 1])  	// Input range: index of bars
		.range(["hsla(128, 66%, 57%, 1)" , "hsla(128, 66%, 57%, 1.0)" ]);   	// Output range: colors

	$: colorScaleOut = scaleLinear()
		.domain([0, numOfHBars - 1]) 	// Input range: index of bars
		.range(["hsla(0, 99%, 63%, 1)", "hsla(0, 99%, 63%, 1.0)"]);   	// Output range: colors





	//Zoom

	$: xScaleZoom = xScale
	// $: xScaleZoomMobile = xScaleMobile
	$: yScaleZoom = yScale
	$: rScaleZoom = 1


	onMount(() => {
        onResize();

	const element = select(stakeFlowChart);
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
					yScaleZoom = event.transform.rescaleY(yScale);

				})
				
		)
    });


	//*** Chart Headings & Settings	***//

	let showContent = ''
	let chartTitle = 'Pool Group Stake Flow';
	let chartInfo = 'This chart shows the ADA stake flowing IN or OUT that is being delegated to stake pool groups. The bars are ordered from greatest to least. \
						Red is stake leaving a pool group, and Green is stake coming in (or delegated) to a pool group.';

	const handleClick = (payload : any) => {
  
		showContent = payload === showContent ? '' : payload
	}
	
	const handleQAClose = () => {
		showContent = ''
		
	}


	//*************************/
    //Chart Function Handler State Machine
    //*************************/

	// Function to handle mouse over pie section
	const hbarMouseOverIn = (event: MouseEvent, d_in: any, i_in: any): void => {
		hoveredDataIn = d_in;
		hoveredIndexIn = i_in;
		hoveredStateIn = true;

	};

	// Function to handle mouse over pie section
	const hbarMouseOverOut = (event: MouseEvent, d_out: any, i_out: any): void => {
		hoveredDataOut = d_out;
		hoveredIndexOut = i_out;
		hoveredStateOut = true;

	};

	// Function to handle mouse over pie section
	const hbarMouseLeave = (event: MouseEvent): void => {
		hoveredStateIn = false;
		hoveredStateOut = false;
		hoveredIndexIn = null;
		hoveredIndexOut = null;


	};

	console.log("hoveredIndexIn", hoveredIndexIn)
	console.log("hoveredIndexOut", hoveredIndexOut)
	console.log("hoveredDataIn", hoveredDataIn)
	console.log("hoveredDataOut", hoveredDataOut)
	console.log("hoveredStateIn", hoveredStateIn)
	console.log("hoveredStateOut", hoveredStateOut)




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
	<svg bind:this={stakeFlowChart} width={width} {height} aria-labelledby="chart-title" aria-describedby="chart-description" role="img">

		<!-- shadow effect	 -->
		<defs>
			<!-- Light Mode Shadow Filter -->
			<filter id="dropshadow-light" height="130%">
				<feGaussianBlur in="SourceAlpha" stdDeviation="3"/> <!-- stdDeviation is the blur amount -->
				<feOffset dx="2" dy="2" result="offsetblur"/> <!-- dx and dy are the x and y offsets of the shadow -->
				<feFlood flood-color="black" result="color" />
				<feComposite in="color" in2="offsetblur" operator="in" result="shadow"/>
				<feComponentTransfer>
					<feFuncA type="linear" slope="0.5"/> <!-- slope is the shadow opacity -->
				</feComponentTransfer>
				<feMerge> 
					<feMergeNode in="shadow"/> <!-- this contains the offset blurred image -->
					<feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
				</feMerge>
			</filter>
		
			<!-- Dark Mode Shadow Filter -->
			<filter id="dropshadow-dark" height="130%">
				<feGaussianBlur in="SourceAlpha" stdDeviation="2"/> <!-- stdDeviation is the blur amount -->
				<feOffset dx="1" dy="1" result="offsetblur"/> <!-- dx and dy are the x and y offsets of the shadow -->
				<feFlood flood-color="white" result="color" />
				<feComposite in="color" in2="offsetblur" operator="in" result="shadow"/>
				<feComponentTransfer>
					<feFuncA type="linear" slope="0.2"/> <!-- slope is the shadow opacity -->
				</feComponentTransfer>
				<feMerge> 
					<feMergeNode in="shadow"/> <!-- this contains the offset blurred image -->
					<feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
				</feMerge>
			</filter>
		</defs>

						 
		<g class="hbar-stake-inflow" transform="translate({width/2} {margin.top})">

			 <!-- in-bar color changes -->
			 <defs>
				{#each top_in_flow as d_in, i_in}
					<linearGradient id={`gradient-${i_in}`} x1="100%" y1="0%" x2="100%" y2="100%">
						<stop offset="85%" stop-color={colorScale(i_in)} />
						<stop offset="100%" stop-color="white" />
					</linearGradient>
				{/each}
			</defs>
			 
			<!-- draw each hbar rect -->
			{#each top_in_flow as d_in, i_in}
				<rect 
					x="0" 
					y={yScale(i_in)} 
					width={xScale(d_in.stakedelta)} 
					height="15"
					rx="4" 
					fill={`url(#gradient-${i_in})`}
					opacity = {hoveredStateIn == false ? (1000/i_in) : i_in == hoveredIndexIn ? 0.5 : 1.0 }
					filter={($colorTheme == '☀️ Daylight') ? "url(#dropshadow-light)" : null }
					on:mouseover={(event) => hbarMouseOverIn(MouseEvent, d_in, i_in)}
					on:mouseleave={() => { hbarMouseLeave(MouseEvent)  }}
					on:focus={() => {  }}
					on:click={() => {  }}
					on:keypress={() => { }}
				/>

			{/each}

		</g>

		<g class="hbar-stake-outflow" transform="scale(-1, 1) translate({-width/2} {margin.top})">

			 <!-- in-bar color changes -->
			 <defs>
				{#each top_out_flow as d_out, i_out}
					<linearGradient id={`gradientOut-${i_out}`} x1="100%" y1="0%" x2="100%" y2="100%">
						<stop offset="85%" stop-color={colorScaleOut(i_out)} />
						<stop offset="100%" stop-color="white" />
					</linearGradient>
				{/each}
			</defs>
			 
			<!-- draw each hbar rect -->
			{#each top_out_flow as d_out, i_out}
				<rect 
					x="0"
					y={yScale(i_out)} 
					width={xScale(Math.abs(d_out.stakedelta))} 
					height="15"
					rx="4" 
					fill={`url(#gradientOut-${i_out})`}
					opacity = {hoveredStateOut == false ? (1000/i_out) : i_out == hoveredIndexOut ? 0.5 : 1.0 }
					filter={($colorTheme == '☀️ Daylight') ? "url(#dropshadow-light)" : null }
					on:mouseover={() => { hbarMouseOverOut(MouseEvent, d_out, i_out)  }}
					on:mouseleave={() => { hbarMouseLeave(MouseEvent)  }}
					on:focus={() => {  }}
					on:click={() => {  }}
					on:keypress={() => { }}
				/>

			{/each}

			{#if hoveredStateOut && $windowWidth > 650}
				<Tooltip x={-width/2} y={hoveredIndexOut} width={xScale(Math.abs(hoveredDataOut.stakedelta))} data={hoveredDataOut} {xScale} {xScaleZoom} {yScale} {yScaleZoom} innerWidth={innerWidth}/>
			{:else if hoveredStateOut && $windowWidth <= 650}
				<Tooltip x={-width/2} y={hoveredIndexOut} width={xScale(Math.abs(hoveredDataOut.stakedelta))} data={hoveredDataOut} {xScale} {xScaleZoom} {yScale} {yScaleZoom} innerWidth={innerWidth}/>
			{/if}

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