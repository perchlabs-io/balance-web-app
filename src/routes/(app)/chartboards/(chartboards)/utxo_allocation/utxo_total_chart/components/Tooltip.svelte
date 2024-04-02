<script lang="ts">

    export let xScale : any;
    export let xScaleZoom : any;
    export let yScale : any;
    export let yScaleZoom : any;
    export let hoveredEpoch : any;
    export let data : any;
    export let color : any;
    const getYValue = (epoch : any) =>
        data.filter((d : any) => (d.epoch) >= epoch)[0]?.high;

    //const formatter = new Intl.NumberFormat('en-US', {
    //    minimumFractionDigits: 2
    //})

    const formatter = new Intl.NumberFormat('en-US', {
    notation: "compact", maximumSignificantDigits: 3
    })

</script>
<circle
    class="circle-format"
    cx={xScaleZoom ? xScaleZoom(hoveredEpoch) : xScale(hoveredEpoch)}
    cy={yScaleZoom ? yScaleZoom(getYValue(hoveredEpoch)) : yScale(getYValue(hoveredEpoch))}
    r="5.5"
    fill={color}
    pointer-events="none"
/>
<text
    class="axis-format"
    x={xScaleZoom ? xScaleZoom(hoveredEpoch) : xScale(hoveredEpoch)}
    dx="12"
    y={yScaleZoom ? yScaleZoom(getYValue(hoveredEpoch)) : yScale(getYValue(hoveredEpoch))}
    pointer-events="none"
    stroke-width="5"
    paint-order="stroke"
>
    ₳ {formatter.format(getYValue(hoveredEpoch))}
    <tspan x={xScaleZoom ? xScaleZoom(hoveredEpoch) : xScale(hoveredEpoch)} dx="12" dy="1.1em"></tspan>
    
</text>
<style>
    text {
        font-weight: 250;
        font-size: 14px;
        
    }
    .axis-format {
        fill: var(--clr-txt);
        stroke: var(--clr-bg);
  
    }
    .circle-format {
        stroke: var(--clr-bg);
    }

    @media (max-width: 650px) {
		text {
        font-weight: 250;
        font-size: 10px;
        
    }
		
 	 }
   
</style>

