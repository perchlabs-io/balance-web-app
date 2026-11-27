<script lang="ts">
    import { area } from "d3-shape";
    interface Props {
        data: any;
        xScale: any;
        xScaleZoom: any;
        yScale: any;
        yScaleZoom: any;
        color: any;
        hoveredEpoch: any;
    }

    let {
        data,
        xScale,
        xScaleZoom,
        yScale,
        yScaleZoom,
        color,
        hoveredEpoch
    }: Props = $props();

        
        
    let dataBeforeHover = $derived(data.filter((d : any) => (d.epoch) <= hoveredEpoch));
    let dataAfterHover = $derived(data.filter((d : any) => (d.epoch) >= hoveredEpoch));
    let AreaGenerator = $derived(area()
        .x((d : any) => xScaleZoom ? xScaleZoom(d.epoch) : xScale(d.epoch))
        .y0((d : any) => yScaleZoom ? yScaleZoom(d.low) : yScale(d.low))
        .y1((d : any) => yScaleZoom ? yScaleZoom(d.high) : yScale(d.high)));
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