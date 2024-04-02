<script lang="ts">

    export let xScale : any;
    export let yScale : any;
    export let hoveredEpoch : any;
    export let data : any;
    export let color : any;
    const getYValue = (epoch : any) =>
        data.filter((d : any) => (d.epoch) >= epoch)[0]?.stat;

    const formatter = new Intl.NumberFormat('en-US', {
  
    minimumFractionDigits: 2
})
</script>
<circle
    class="circle-format"
    cx={xScale(hoveredEpoch)}
    cy={yScale(getYValue(hoveredEpoch))}
    r="5.5"
    fill={color}
    pointer-events="none"
/>
<text
    class="axis-format"
    x={xScale(hoveredEpoch)}
    dx="12"
    y={yScale(getYValue(hoveredEpoch))}
    pointer-events="none"
    stroke-width="5"
    paint-order="stroke"
>
   
    {formatter.format(getYValue(hoveredEpoch))}
    <tspan x={xScale(hoveredEpoch)} dx="12" dy="1.1em"></tspan>
    
</text>
<style>
    text {
        font-weight: 500;
        font-size: 12px;
        
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
            font-weight: 500;
            font-size: 10px;
            
        }
    }
   
</style>

