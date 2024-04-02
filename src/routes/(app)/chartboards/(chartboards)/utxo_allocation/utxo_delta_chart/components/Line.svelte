<script lang="ts">
    export let data : any;
    export let xScale : any;
    export let yScale : any;
    export let xScaleZoom : any;
    export let yScaleZoom : any;
    export let color : any;
    export let hoveredEpoch : any;
    $: dataBeforeHover = data.filter((d : any) => (d.epoch) <= hoveredEpoch);
    $: dataAfterHover = data.filter((d : any) => (d.epoch) >= hoveredEpoch);
    import { line } from "d3-shape";
    $: lineGenerator = line()
        .x((d : any) => xScaleZoom ? xScaleZoom(d.epoch) : xScale(d.epoch))
        .y((d : any) => yScaleZoom ? yScaleZoom(d.delta) : yScale(d.delta));
</script>



<path
    d={lineGenerator(dataBeforeHover)}
    stroke={color}
    fill="transparent"
    stroke-width="2.5"
    
    
/>

<path
    d={lineGenerator(dataAfterHover)}
    stroke={color}
    fill="transparent"
    stroke-width="2.5"
    opacity=".15"
    
    
/>

