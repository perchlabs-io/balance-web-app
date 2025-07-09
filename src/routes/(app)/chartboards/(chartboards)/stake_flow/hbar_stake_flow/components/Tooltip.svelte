<script lang="ts">
    import { fade } from 'svelte/transition';
    import { windowWidth, windowHeight, colorTheme } from '$lib/stores/mychart';
    //import { AxisXvar, AxisYvar } from '$lib/stores/mychart';
    
    
    export let x: any;
    export let y: any;
    export let width: any;
    export let data : any;
    export let xScale : any;
    export let yScale : any;
    export let xScaleZoom : any;
    export let yScaleZoom : any;
    export let innerWidth : any;
    
    
    //let width = 1100;

    const formatter = new Intl.NumberFormat('en-US', {
      //notation: "compact", maximumSignificantDigits: 3
      minimumFractionDigits: 2
  
    })

    $windowWidth = window.innerWidth;
    $: x = x - width;

    console.log("data x", x)
    console.log("data y", y)
    console.log("data width", width)
    console.log("data tooltip", data)
    
    $: x = x - width;
    
  </script>
 
    <div class='tooltip' bind:clientWidth={innerWidth} in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}  style="position: absolute;
      top: {yScaleZoom ? yScaleZoom(y) + 5 : yScale(y) + 5}px;
      left: {$windowWidth > 650 ? (x > 20 ? (xScaleZoom ? xScaleZoom(x) - 158 : xScale(x) - 158) : (xScaleZoom ? xScaleZoom(x) + 75 : xScale(x) + 75)) : (x > 20 ? (xScaleZoom ? xScaleZoom(x) - 158 : xScale(x) - 158) : (xScaleZoom ? xScaleZoom(x) + 35 : xScale(x) + 35))}px"
    >
    
    <p class="tooltip-item"><strong>Pool Group:</strong>&nbsp;&nbsp;&nbsp;&nbsp; {data.poolgroup}</p> 
    <p class="tooltip-item"><strong>Stake Delta:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₳ {formatter.format(data.stakedelta)}</p>
    <p class="tooltip-item"><strong>Stake Delta %:</strong>&nbsp;&nbsp;&nbsp; ₳ {formatter.format(data.stakeprctdelta)}</p>
    
    
    </div>


  
  <style>
    .tooltip {
      padding-left: var(--spacing-18);
      padding-right: var(--spacing-18);
      padding-top: var(--spacing-8);
      padding-bottom: var(--spacing-8);
      background: var(--clr-bg-opc);
      border-radius: var(--rounded-4);
      box-shadow: 0 0 0 2px var(--clr-primary);
      pointer-events: none;
      width: 235px;
      
      
      
      
    }
    .tooltip-item{
      line-height: 25px;
      color: var(--clr-card-txt);
      font-weight: 500;
		  font-size: var(--font-14);
      
    }

    @media (max-width: 650px) {
      .tooltip {
        padding-left: var(--spacing-18);
      padding-right: var(--spacing-18);
      padding-top: var(--spacing-8);
      padding-bottom: var(--spacing-8);
      background: var(--clr-bg-opc);
      border-radius: var(--rounded-4);
      box-shadow: 0 0 0 2px var(--clr-primary);
      pointer-events: none;
      width: 195px;
      
      }
      .tooltip-item{
        line-height: 20px;
        color: var(--clr-card-txt);
        font-weight: 400;
        font-size: var(--font-12);
        
      }
 	  }
    
  
    
  </style>