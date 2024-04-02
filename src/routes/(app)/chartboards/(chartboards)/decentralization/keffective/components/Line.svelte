<script lang="ts">
    export let data : any;
    export let xScale : any;
    export let yScale : any;
    export let color : any;
    export let hoveredEpoch : any;
    $: dataBeforeHover = data.filter((d : any) => (d.epoch) <= hoveredEpoch);
    $: dataAfterHover = data.filter((d : any) => (d.epoch) > hoveredEpoch);
    import { line } from "d3-shape";
    $: lineGenerator = line()
        .x((d : any) => xScale(d.epoch))
        .y((d : any) => yScale(d.stat));
</script>

<path
    d={lineGenerator(dataBeforeHover)}
    stroke={color}
    fill="transparent"
    stroke-width="3"
/>

<path
    d={lineGenerator(dataAfterHover)}
    stroke={color}
    fill="transparent"
    stroke-width="3"
    opacity=".35"
/>