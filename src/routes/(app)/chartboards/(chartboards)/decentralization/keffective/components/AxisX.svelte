<script lang="ts">
  
    export let height : any;
    export let width : any;
    export let xScale : any;
    export let hoveredEpoch : any;
    export let isUnhovered : any;
    export let windowWidth : any;
    // Format our ticks as short date strings
    //import { timeFormat } from "d3-time-format";
    //const dateFormat = timeFormat("%b %e");
    const TICK_LENGTH = 8;
    $: ticks = isUnhovered ? xScale.ticks(10) : [(hoveredEpoch)];

    

    //let xTicks = [210, 211, 212, 213, 214, 215, 216, 217];
</script>

{#each ticks as tick}
    <line
        x1={xScale(tick)}
        x2={xScale(tick)}
        y1={height}
        y2={height + TICK_LENGTH}
        
    />
    <text
        class="axis-format-tick"
        x={xScale(tick)}
        y={height + TICK_LENGTH}
        dy="6"
        dominant-baseline="hanging"
        font-size="11px"
        text-anchor="middle"
        font-weight=400
    >
        {(tick)} 
    </text>
    <text
    class="axis-format-label"
        y={height + TICK_LENGTH * 5.8}
        x={width / 2 - 15} 
        
        font-size="12px"
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
  }
   

  
  </style>