<script lang="ts">
    export let data : any;
    export let xScale : any;
    export let xScaleZoom : any;
    export let yScale : any;
    export let yScaleZoom : any;
    export let color : any;
    export let hoveredEpoch : any;
    $: dataBeforeHover = data.filter((d : any) => (d.epoch) <= hoveredEpoch);
    $: dataAfterHover = data.filter((d : any) => (d.epoch) >= hoveredEpoch);
    import { area } from "d3-shape";
    $: AreaGenerator = area()
        .x((d : any) => xScaleZoom ? xScaleZoom(d.epoch) : xScale(d.epoch))
        .y0((d : any) => yScaleZoom ? yScaleZoom(d.low) : yScale(d.low))
        .y1((d : any) => yScaleZoom ? yScaleZoom(d.high) : yScale(d.high));

        
        
</script>

<path
    d={AreaGenerator(dataBeforeHover)}
    stroke={color}
    fill={color}
    stroke-width="4"
    opacity=".55"
/>

<path
    d={AreaGenerator(dataAfterHover)}
    stroke={color}
    fill={color}
    stroke-width="4"
    opacity=".35"
/>