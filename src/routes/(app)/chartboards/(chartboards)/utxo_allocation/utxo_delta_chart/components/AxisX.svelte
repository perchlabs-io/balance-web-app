<script lang="ts">
  
  export let height : any;
  export let width : any;
  export let xScale : any;
  export let xScaleZoom : any;
  export let hoveredEpoch : any;
  export let isUnhovered : any;
  // Format our ticks as short date strings
  //import { timeFormat } from "d3-time-format";
  //const dateFormat = timeFormat("%b %e");
  const TICK_LENGTH = 8;

  let zoomCheck : any;
  
  
  $: ticks= xScaleZoom && isUnhovered ? xScaleZoom.ticks(9) : isUnhovered ? xScale.ticks(9) : [(hoveredEpoch)]
  
  

  
</script>

{#each ticks as tick}
  <line
      x1={xScaleZoom ? xScaleZoom(tick) : xScale(tick)}
      x2={xScaleZoom ? xScaleZoom(tick) : xScale(tick)}
      y1={height}
      y2={height + TICK_LENGTH}
      
  />
  <text
      class="axis-format-tick"
      x={xScaleZoom ? xScaleZoom(tick) : xScale(tick)}
      y={height + TICK_LENGTH}
      dy="6"
      dominant-baseline="hanging"
      
      text-anchor="middle"
      font-weight=400
  >
    {#if tick % 1 == 0}
      {(tick)}
    {/if}  
  
    
  </text>
  <text
  class="axis-format-label"
      y={height + TICK_LENGTH * 6}
      x={width / 2 -15} 
      
      
      letter-spacing="1px"
      >Epoch
   </text>
{/each}

<style>
  .axis-format-tick {
    font-size: 12px;
    fill: var(--clr-txt);

  }
  .axis-format-label {
    font-size: 12px;
    fill: var(--clr-txt);

  }
 
  @media (max-width: 650px) {
		.axis-format-tick {
      font-size: 10px;
      fill: var(--clr-txt);

    }
    .axis-format-label {
      font-size: 12px;
      fill: var(--clr-txt);

    }
		
 	 }


</style>