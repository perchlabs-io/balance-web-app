<script lang="ts">
	
	import { PlayIcon } from '@rgossiaux/svelte-heroicons/outline'
	import { PauseIcon } from '@rgossiaux/svelte-heroicons/outline'
	import { ArrowLeftIcon } from '@rgossiaux/svelte-heroicons/outline'
	import { ChartPieIcon } from '@rgossiaux/svelte-heroicons/solid'
	import RangeSlider from "svelte-range-slider-pips";
	import { tweened } from 'svelte/motion'
    import { cubicOut } from 'svelte/easing'
    import { selectedEpoch, selectedEpoch2 } from '$lib/stores/mychart';
	import {
		Popover,
		PopoverButton,
		PopoverPanel,
	} from '@rgossiaux/svelte-headlessui'
	import { zoom, zoomIdentity } from "d3-zoom";
	import { onMount } from "svelte";
	import { select } from "d3-selection";
	import { windowWidth, windowHeight, colorTheme } from '$lib/stores/mychart';
	import debounceFn from "lodash.debounce";
	
	
	export let curMAVData : any;
	export let selectedData : any;
	export let poolGroupData : any;
	export let maxEpochData : any;
	export let minEpochData : any;




	//*************************/
	//Group Stake v. Leverage
	//*************************/

	let ticker = '';
	let levChart : any;
	let epoch2 : number;
	let waiting = false;
	let interval : any;
	//let width = 1100;
    //let height = 500;
	let hoveredData : any;
	let sliderConfig : any = { stiffness: 0.1, damping: 0.8 }
	//let sliderConfig : any = { stiffness: 0.15, damping: 0.5 }
	let chartTitle = 'Group Stake v. Leverage';
	let chartInfo = 'This chart portrays the stake pool grouping landscape of stake versus leverage throughout epochs of time. Use the slider and press play to see how the MAV and Network Average (red dot) change over time.';
	let xScaleZoom : any;
	let xScaleZoomMobile : any;
	let yScaleZoom : any;
	let rScaleZoom : any;
	
	$: filterOnEpoch = () => {
		selectedEpoch.set(epoch[0]);
		clearInterval(interval);
	};

	const startInterval = ()=>{
		clearInterval(interval)
			interval = setInterval(()=> {
		if (epoch2 < maxEpochData) {
			epoch2++
			
			selectedEpoch.set(epoch2)

		} else {
			clearInterval(interval)
			
		}
	}, 750)
	}

    //const margin = { top: 80, right: 50, left: 95, bottom: 50 };
	const margin = { top: 5, right: 15, bottom: 65, left: 75 };
	const marginMobile = { top: 5, right: 10, bottom: 65, left: 35 };
	let height = 600;
	let width = 1150;

	let innerHeight = height - margin.top - margin.bottom;
	$: innerWidth = width - margin.left - margin.right;
	$: innerWidthMobile = width - marginMobile.left - marginMobile.right;
	
	$: poolGroupData = poolGroupData;
    $: curMAVData2 = curMAVData[$selectedEpoch2][0].mc;
	$: selectedData2 = selectedData[$selectedEpoch2];
	$: maxEpochData2 = maxEpochData;
	//$: minEpochData2 = minEpochData;
	$: epoch = [epoch2];
	$: epoch2 = $selectedEpoch;
	//$: windowWidth2 = window.innerWidth;

	
    
	selectedEpoch.set(maxEpochData);

    import { scaleLinear, scaleLog } from "d3-scale";
    $: xScale = scaleLog()
        .domain([1, 1300])
        //.range([margin.left, width - margin.right]);
		.range([20, innerWidth]);
	
	$: xScaleMobile = scaleLog()
        .domain([1, 1300])
        //.range([margin.left, width - margin.right]);
		.range([20, innerWidthMobile]);

    $: yScale = scaleLog()
        .domain([1000000, 3500000000])
        //.range([height - margin.top - margin.bottom, 0]);
		.range([innerHeight, 0]);

	//$: xScaleZoom = xScale;
	//$: yScaleZoom = yScale;
    
    
    import AxisX from "./components/AxisX.svelte";
    import AxisY from "./components/AxisY.svelte";
    import Tooltip from "./components/Tooltip.svelte";
	  
    const params = {
		delay: 100,
		duration: 750,
		easing: cubicOut
	  };

	const tData = tweened(selectedData2, params);
	  
	$: tData.set(selectedData2);

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

	//*************************/
	//Group Search - Locate specific pool group on chart
	//*************************/

	import GroupSearch from "./components/GroupSearch.svelte";

	/* FILTERING countres DATA BASED ON INPUT */	
	let filteredGroups : any = [];
	// $: console.log(filteredCountries)	

	const filterGroups = () => {
		let storageArr : any = []
		if (inputValue) {
			poolGroupData.forEach(( group :any ) => {
				if (group.toLowerCase().startsWith(inputValue.toLowerCase())) {
					storageArr = [...storageArr, makeMatchBold(group)];
				}
			});
		}
		filteredGroups = storageArr;
	}	


	/* HANDLING THE INPUT */
	let searchInput : any; // use with bind:this to focus element
	let inputValue = "";
	let groupSelect = "";
		
	$: if (!inputValue) {
		filteredGroups = [];
		hiLiteIndex = null;
	}

	const clearInput = () => {
		inputValue = "";	
		searchInput.focus();
	}
		
	const setInputVal = (groupName : any) => {
		inputValue = removeBold(groupName);
		filteredGroups = [];
		hiLiteIndex = null;
		document.querySelector('#group-input');
	}	

	const submitValue = () => {
		if (inputValue) {
			console.log(`${inputValue} is submitted!`);
			groupSelect = inputValue;
			setTimeout(clearInput, 1000);
		} else {
			alert("You didn't type anything.")
		}
	}

	const makeMatchBold = (str : any) => {
		// replace part of (country name === inputValue) with strong tags
		let matched = str.substring(0, inputValue.length);
		let makeBold = `<strong>${matched}</strong>`;
		let boldedMatch = str.replace(matched, makeBold);
		return boldedMatch;
	}

	const removeBold = (str : any) => {
		//replace < and > all characters between
		return str.replace(/<(.)*?>/g, "");
		// return str.replace(/<(strong)>/g, "").replace(/<\/(strong)>/g, "");
	}	
		

	/* NAVIGATING OVER THE LIST OF COUNTRIES W HIGHLIGHTING */	
	let hiLiteIndex : any = null;
	//$: console.log(hiLiteIndex);	
	$: hiLitedCountry = filteredGroups[hiLiteIndex]; 	
		
	const navigateList = (e : any) => {
		if (e.key === "ArrowDown" && hiLiteIndex <= filteredGroups.length-1) {
			hiLiteIndex === null ? hiLiteIndex = 0 : hiLiteIndex += 1
		} else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
			hiLiteIndex === 0 ? hiLiteIndex = filteredGroups.length-1 : hiLiteIndex -= 1
		} else if (e.key === "Enter") {
			setInputVal(filteredGroups[hiLiteIndex]);
		} else {
			return;
		}
	} 

	let currWindowWidth = $windowWidth;
    let debounce = 10000000000;

	const onResize = () => {
        $windowWidth = window.innerWidth;
        $windowHeight = Math.min(window.innerHeight,700);
        $colorTheme = localStorage.theme;
		
		
	};

	

	$: xScaleZoom = xScale
	$: xScaleZoomMobile = xScaleMobile
	$: yScaleZoom = yScale
	$: rScaleZoom = 1

	onMount(() => {        

	//$windowWidth = window.innerWidth;
	onResize();

	const element = select(levChart);
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
					rScaleZoom = event.transform.k;

				})
				
		)
    });

</script>

<svelte:window
  on:load={onResize}
  on:resize={debounceFn(onResize, debounce)}
  
  on:keydown={navigateList}
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
		<div class="epoch">
			<h4>Epoch&nbsp;&nbsp;&nbsp;{$selectedEpoch}</h4>
		</div>
		<div class="mavcount">
			<h4>MAV&nbsp;&nbsp;&nbsp;{curMAVData2}</h4>
		</div>
		<div class="mavlegend">
			<h4>&lt; 49%</h4><ChartPieIcon style="color:rgb(44, 154, 255, 0.75);"  width="17" /><h4>> 51%</h4><ChartPieIcon style="color:rgb(131, 106, 249, 0.75);" width="17" />
		</div>
		<div class="poolsearch">
			
			<form  on:submit|preventDefault={submitValue}>
				
				  <input type="text"
								   placeholder="Group Search" 
								   bind:this={searchInput}
								   bind:value={inputValue} 
								   on:input={filterGroups}/>
				
				  
				
				  
			</form>
			
		</div>

	</section>

	
		{#if filteredGroups.length > 0}
		<section class="groupbox" transition:slide={{ duration: 200 }}>
				<div class="groupresults">
					
								{#each filteredGroups as group, i}
									<div class="groupitem">
									<GroupSearch itemLabel={group} highlighted={i === hiLiteIndex} on:click={() => setInputVal(group)} />
									</div>
								{/each}			
				</div>
							
						
		</section>
		{/if}


	

	<section class="hero">
		
		
		<div class='chart-container' 
		bind:clientWidth={width}
		  
		  >
		<svg bind:this={levChart} {width} {height}>

		{#if $windowWidth > 650}
			<defs>
				<clipPath id="group-1">
				<rect x="0" y="0" width={innerWidth +20} height={innerHeight} />
				</clipPath>
		
			</defs>
			
		<g transform="translate({margin.left} {margin.top})">
			<AxisX 
			height={innerHeight}
			width={innerWidth}
			xScale={xScale} 
			xScaleZoom={xScaleZoom} 
			margin={margin} 
			 
			/>
	 		 <AxisY 
			  
			width={innerWidth} 
			windowWidth={$windowWidth}
			{yScale} 
			{yScaleZoom} 
			margin={margin} />
		</g>
		{:else}

		<defs>
			<clipPath id="group-1">
			<rect x="0" y="0" width={innerWidthMobile +20} height={innerHeight} />
			</clipPath>
	
		</defs>

		<g transform="translate({marginMobile.left} {marginMobile.top})">
			<AxisX 
			height={innerHeight}
			width={innerWidthMobile}
			xScale={xScaleMobile} 
			xScaleZoom={xScaleZoomMobile} 
			margin={marginMobile} 
			 
			/>
	 		 <AxisY 
			  
			width={innerWidthMobile} 
			windowWidth={$windowWidth}
			{yScale} 
			{yScaleZoom} 
			margin={marginMobile} />
		</g>
		{/if}
		
		{#if $windowWidth > 650}

		  <g clip-path="url(#group-1)" class='circles' transform="translate({margin.left} {margin.top})" >
			
			{#each $tData as myData}
			  <circle
					cx={xScaleZoom ?  xScaleZoom(myData.x) : xScale(myData.x)} 
					cy={yScaleZoom ?  yScaleZoom(myData.y) : yScale(myData.y)} 
					r={hoveredData && hoveredData == myData ? myData.pg == (inputValue) ? ((myData.r) * 1.30) * rScaleZoom : ((myData.r) * 1.25) * rScaleZoom : (myData.r) != 0 ? myData.pg == (inputValue) ? ((myData.r) * 1.30) * rScaleZoom : myData.r * rScaleZoom : myData.r * rScaleZoom}
                    opacity={"0.75"}
					fill={myData.pg == (inputValue) ? 'rgb(245, 188, 66, 0.9' : myData.mc == 1 ? "rgb(131, 106, 249, 0.5)" : myData.mc == 3 ? "rgb(255, 78, 78, 0.78)" : "rgb(44, 154, 255, 0.5)"}
					stroke={myData.pg == (inputValue) ? 'rgb(245, 188, 66, 1' : myData.mc == 1 ? "rgb(131, 106, 249, 1)" : myData.mc == 3 ? "rgb(255, 78, 78, 1)" : "rgb(44, 154, 255, 1)"}
					
					
					
					on:mouseover={() => {
						hoveredData = myData;
					  }}
					  on:mouseleave={() => {
						hoveredData = null;
					  }}
					  on:focus={() => {
						hoveredData = myData;
					  }}
  
					tabIndex="0"
					/>
		  {/each}
		  </g>
		
		{:else}

		<g clip-path="url(#group-1)" class='circles' transform="translate({marginMobile.left} {marginMobile.top})" >
			
			{#each $tData as myData}
			  <circle
					cx={xScaleZoomMobile ?  xScaleZoomMobile(myData.x) : xScaleMobile(myData.x)} 
					cy={yScaleZoom ?  yScaleZoom(myData.y) : yScale(myData.y)} 
					r={hoveredData && hoveredData == myData ? myData.pg == (inputValue) ? ((myData.r) * 1.30) * rScaleZoom : ((myData.r) * 1.25) * rScaleZoom : (myData.r) != 0 ? myData.pg == (inputValue) ? ((myData.r) * 1.30) * rScaleZoom : myData.r * rScaleZoom : myData.r * rScaleZoom}
                    opacity={"0.75"}
					fill={myData.pg == (inputValue) ? 'rgb(245, 188, 66, 0.9' : myData.mc == 1 ? "rgb(131, 106, 249, 0.5)" : myData.mc == 3 ? "rgb(255, 78, 78, 0.78)" : "rgb(44, 154, 255, 0.5)"}
					stroke={myData.pg == (inputValue) ? 'rgb(245, 188, 66, 1' : myData.mc == 1 ? "rgb(131, 106, 249, 1)" : myData.mc == 3 ? "rgb(255, 78, 78, 1)" : "rgb(44, 154, 255, 1)"}
					
					
					
					on:mouseover={() => {
						hoveredData = myData;
					  }}
					  on:mouseleave={() => {
						hoveredData = null;
					  }}
					  on:focus={() => {
						hoveredData = myData;
					  }}
  
					tabIndex="0"
					/>
		  {/each}
		  </g>

		{/if}


		</svg>
		{#if hoveredData && $windowWidth > 650}
			<Tooltip data={hoveredData} {xScale} {xScaleZoom} {yScale} {yScaleZoom} innerWidth={innerWidth}/>
		{:else if hoveredData && $windowWidth <= 650}
			<Tooltip data={hoveredData} xScale={xScaleMobile} xScaleZoom={xScaleZoomMobile} {yScale} {yScaleZoom} innerWidth={innerWidthMobile}/>
		{/if}
		</div>
	
	</section>

		
		
	<section class="inputbox" >
		{#if $windowWidth > 650}
			<div class="control">
				<button class="controlicon" >
				<PlayIcon on:click={startInterval} width="45" height="45"/>
				</button>
				<button class="controlicon">
				<PauseIcon on:click={()=>{ clearInterval(interval)}} width="45" height="45"/>
				</button>
				<button class="controliconreset">
				<ArrowLeftIcon on:click={() =>{ selectedEpoch.set(210); epoch2 = 210; }} width="45" height="45"/>
				</button>
			</div>
		{:else if $windowWidth <= 650}
			<div class="control">
				<button class="controlicon" >
				<PlayIcon on:click={startInterval} width="40" height="40"/>
				</button>
				<button class="controlicon">
				<PauseIcon on:click={()=>{ clearInterval(interval)}} width="40" height="40"/>
				</button>
				<button class="controliconreset">
				<ArrowLeftIcon on:click={() =>{ selectedEpoch.set(210); epoch2 = 210; }} width="40" height="40"/>
				</button>
			</div>

		{/if}
			<div class="rangeslider">
				
				<RangeSlider
				
				min={210} max={(maxEpochData2)}
				
				bind:values={epoch}
				springValues={sliderConfig}
				pips
				id="reverse-pips"
				pipstep={30}
				float 
				hoverable={true}
				first='label'
				rest='label'
				last={false}
				
				
				on:stop={filterOnEpoch}	
				/>

				<style>
					#reverse-pips .pip {
					color: var(--clr-piplbl-sldr);
					
					}
				</style>
				
			</div>	
	</section>

		

<style>
	circle {
		transition: r 100ms ease, opacity 200ms ease;
		cursor: pointer;
	}

	circle:focus {
		outline: none;
	}

	.hero {
		margin-top: var(--spacing-16);
		padding: var(--spacing-16);
		
	}

	.heroheader {
		
		display: grid;
		
	}

	.heroheadertext {
		margin-top: 8px;
		margin-bottom: 8px;
		font-size: 20px;
		letter-spacing: .25px;
			
	}

	.inputbox {
		margin-top: var(--spacing-16);
		
		display: grid;
		row-gap: var(--spacing-16);
		align-items: center;
		align-self: start;
		
	}

	.rangeslider {	
		
		justify-content: center;
		gap: var(--spacing-32);
		padding: var(--spacing-16);
		border: 1.5px solid var(--clr-menu-border);
		--range-handle-inactive: var(--clr-primary);
		--range-handle: var(--clr-primary);
		--range-handle-focus: var(--clr-primary);
		--range-float-text: var(--clr-txt-sldr);
		--range-slider: var(--clr-bar-sldr);
		
		
	}
	.poolsearch {
		display: flex;
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: var(--spacing-10);
		padding-bottom: var(--spacing-10);
		align-items: center;
		border: 1.5px solid var(--clr-menu-border);
		
	}
	
	
	.mavcount {
		display: flex;
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		align-items: center;
		border: 1.5px solid var(--clr-menu-border);
		
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
	
	.epoch {
		display: flex;
		
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		border: 1.5px solid var(--clr-menu-border);
		
		

	}
	
	.control {
		display: flex;
		
		justify-content: center;
		gap: var(--spacing-32);
		padding-top: 28px;
		padding-bottom: 28px;
		border: 1.5px solid var(--clr-menu-border);
		
		
	}
	.controlicon {
		display: flex;
		
		justify-content: center;
		gap: var(--spacing-32);
		
		transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;
		
	}
	
	.controlicon:hover {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		border-radius: var(--rounded-4);
		box-shadow: 0 0 0 1px var(--clr-primary);
		
	}
	.controlicon:focus {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		border-radius: var(--rounded-4);
		box-shadow: 0 0 0 1px var(--clr-primary);
		
	}
	.controlicon:active {
		
		box-shadow: 0 0 0 3px var(--clr-primary);
		transition: box-shadow 0.07s ease;
	}
	.controliconreset {
		border-radius: var(--rounded-4);
		display: flex;
		
		justify-content: center;
		gap: var(--spacing-32);
		transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;
		
	}
	
	.controliconreset:hover {
		background-color: var(--clr-primary-hover-bg);
		color: var(--clr-primary);
		border-radius: var(--rounded-4);
		box-shadow: 0 0 0 1px var(--clr-primary);
		
	}
	.controliconreset:active {
		
		box-shadow: 0 0 0 3px var(--clr-primary);
		transition: box-shadow 0.07s ease;
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
		box-shadow: var(--shadow-md), 0 0 0 2px var(--clr-primary);
		border-radius: 0;
	}
	.chartdetail {
		gap: var(--spacing-16);
		padding: var(--spacing-18);

	}
	
	form {
		display: flex;
		max-width: 160px;
		border-radius: var(--rounded-4);
		border: 1px solid var(--clr-input-border);
		transition: all 0.2s ease-in-out;
		
	}
	form:hover {
		border-radius: var(--rounded-4);
		border: 1px solid var(--clr-primary);

	}
	input {
		width: 100%;
		border-radius: var(--rounded-4) !important;
		padding: var(--spacing-4) var(--spacing-18);
		background-color: var(--clr-input-bg);
		
	}
	input::placeholder {
		color: var(--clr-input-placeholder-txt);
		
	}
	
	.groupbox{
		display: grid;
		margin-top: var(--spacing-16);
		row-gap: var(--spacing-16);
		align-items: center;
		align-self: start;
		justify-content: center;
		gap: var(--spacing-18);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		padding-left: var(--spacing-32);
		padding-right: var(--spacing-12);
		align-items: center;
	
	}
	.groupresults {
		display: grid;
		max-height: 250px;
		row-gap: var(--spacing-4);
		grid-auto-flow: row;
		grid-template-columns: unset; /* do not set template columns and rows */
		grid-template-rows: unset;
		overflow: scroll;
	}
	.groupitem {
		padding-top: var(--spacing-18);
	}
	::-webkit-scrollbar-corner {
  		background: rgba(0,0,0,0);
	}
	
	

	@media (min-width: 1060px) {
		
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
		
		.rangeslider {
			grid-column: column-start 5 / span 8;
		}
		.control {
			grid-column: column-start 1 / span 4 ;

		}
		.epoch {
			grid-column: column-start 1 / span 2 ;

		}
		.mavcount {
			grid-column: column-start 3 / span 2 ;

		}
		.mavlegend {
			grid-column: column-start 5 / span 5 ;

		}
		.poolsearch {
			grid-column: column-start 10 / span 3 ;
		}
		.charttitle {
			
			grid-column: column-start 1 / span 12 ;
		}
		.chartdetail {
			
			grid-column: column-start 2 / span 10 ;
		}
		
		.groupresults {
			display: grid;
			grid-template-columns: repeat(8, [column-start] 1fr);
			column-gap: var(--spacing-42);
		}
		
		
	}

	@media (max-width: 1060px) {
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
		
		.rangeslider {
			grid-column: column-start 6 / span 7;
		}
		.control {
			grid-column: column-start 1 / span 5 ;

		}
		.epoch {
			grid-column: column-start 1 / span 6 ;

		}
		.mavcount {
			grid-column: column-start 7 / span 6 ;

		}
		.mavlegend {
			grid-column: column-start 1 / span 6 ;

		}
		.poolsearch {
			grid-column: column-start 7 / span 6 ;
		}
		.charttitle {
			
			grid-column: column-start 1 / span 12 ;
		}
		.chartdetail {
			
			grid-column: column-start 2 / span 10 ;
		}
		
		.groupresults {
			display: grid;
			grid-template-columns: repeat(6, [column-start] 1fr);
			column-gap: var(--spacing-42);
		}
	
	}


	@media (max-width: 760px) {
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
		
		.rangeslider {
			grid-column: column-start 1 / span 12;
		}
		.control {
			grid-column: column-start 1 / span 12 ;

		}
		.poolsearch {
			grid-column: column-start 1 / span 12 ;
		}
		.mavlegend {
			grid-column: column-start 1 / span 12 ;

		}
		.mavcount {
			grid-column: column-start 1 / span 12 ;

		}
		.epoch {
			grid-column: column-start 1 / span 12 ;

		}
		.charttitle {
			
			grid-column: column-start 1 / span 12 ;
		}
		.chartdetail {
			
			grid-column: column-start 2 / span 10 ;
		}
		.groupresults {
			display: grid;
			grid-template-columns: repeat(4, [column-start] 1fr);
			column-gap: var(--spacing-24);
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
		.rangeslider {	
			font-size: var(--font-14);
			justify-content: center;
			gap: var(--spacing-32);
			padding: var(--spacing-16);
			border: 1.5px solid var(--clr-menu-border);
			--range-handle-inactive: var(--clr-primary);
			--range-handle: var(--clr-primary);
			--range-handle-focus: var(--clr-primary);
			--range-float-text: var(--clr-txt-sldr);
			--range-slider: var(--clr-bar-sldr);
			
			
		}
 	 }

	
</style>