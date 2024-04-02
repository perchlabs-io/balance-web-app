<script lang="ts">
                  
                 
    export let width : any;
    export let yScale : any;
    export let yScaleZoom : any

    const formatter = new Intl.NumberFormat('en-US', {
    notation: "compact", maximumSignificantDigits: 3
  
})

    let ticks : any;
    $: ticks = yScaleZoom ? yScaleZoom.ticks(10) : yScale.ticks(10)

</script>

{#each ticks as tick}
    <text
        class="axis-format"
        x="-12"
        dx="0"
        y={yScaleZoom ? yScaleZoom(tick) : yScale(tick)}
        text-anchor="end"
        dominant-baseline="middle"
        font-weight=400
        font-size="12px"
    >
        
        ₳ {formatter.format(tick)}
    </text>
    <line 
        class="line-format" 
        x1="0" 
        x2={width}
        y1={yScaleZoom ? yScaleZoom(tick) : yScale(tick)} 
        y2={yScaleZoom ? yScaleZoom(tick) : yScale(tick)} />
{/each}


<style>
    .axis-format {
      font-size: 12px;
      fill: var(--clr-txt);
  
    }
    .line-format {
      stroke: var(--clr-chart-line);
    }

    @media (max-width: 650px) {
		.axis-format {
            font-size: 10px;
            fill: var(--clr-txt);
        
            }
		
 	 }
  
  
  
</style>