<script lang="ts">
    interface Props {
        xScale: any;
        xScaleZoom: any;
        margin: any;
        width: any;
        height: any;
        hoveredEpoch: any;
        isHovered: any;
        maxEpoch: any;
    }

    let {
        xScale,
        xScaleZoom,
        margin,
        width,
        height,
        hoveredEpoch = $bindable(),
        isHovered = $bindable(),
        maxEpoch
    }: Props = $props();
    const handleMousemove = function (e : any) {
        hoveredEpoch = xScaleZoom ? Math.round(xScaleZoom.invert(e.offsetX - margin.left)) : Math.round(xScale.invert(e.offsetX - margin.left));
        isHovered = true;
      
    };
    const handleMouseleave = function () {
        hoveredEpoch = maxEpoch;
        isHovered = false;
    };
</script>

<rect
    class="hover-listener"
    fill="transparent"
    {width}
    {height} 
    onmousemove={handleMousemove}
    onmouseleave={handleMouseleave}
/>

<line
    class="line-format"
    x1={xScaleZoom ? xScaleZoom(hoveredEpoch) : xScale(hoveredEpoch)}
    x2={xScaleZoom ? xScaleZoom(hoveredEpoch) : xScale(hoveredEpoch)}
    y1={0}
    y2={height}
    
    stroke-dasharray="2, 2"
    pointer-events="none"
/>

<style>
    rect {
        cursor: crosshair;
    }
    .line-format {
      stroke: var(--clr-card-txt);
    }
</style>