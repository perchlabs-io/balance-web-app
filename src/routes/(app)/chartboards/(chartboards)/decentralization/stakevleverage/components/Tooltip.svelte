<script lang="ts">
    import { fade } from 'svelte/transition';
    import { windowWidth, windowHeight, colorTheme } from '$lib/stores/mychart';
    //import { AxisXvar, AxisYvar } from '$lib/stores/mychart';
    
    

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
  
    
    
  </script>
 
    <div class='tooltip' bind:clientWidth={innerWidth} in:fade|global={{ duration: 300 }} out:fade|global={{ duration: 200 }}  style="position: absolute;
      top: {yScaleZoom ? yScaleZoom(data.y) + 5 : yScale(data.y) + 5}px;
      left: {$windowWidth > 650 ? (data.x > 20 ? (xScaleZoom ? xScaleZoom(data.x) - 158 : xScale(data.x) - 158) : (xScaleZoom ? xScaleZoom(data.x) + 75 : xScale(data.x) + 75)) : (data.x > 20 ? (xScaleZoom ? xScaleZoom(data.x) - 158 : xScale(data.x) - 158) : (xScaleZoom ? xScaleZoom(data.x) + 35 : xScale(data.x) + 35))}px"
    >
    
    <p class="tooltip-item"><strong>Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp; {data.pg}</p> 
    <p class="tooltip-item"><strong>Stake:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₳ {formatter.format(data.y)}</p>
    <p class="tooltip-item"><strong>Pledge:</strong>&nbsp;&nbsp;&nbsp; ₳ {formatter.format(data.pa)}</p>
    
    
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