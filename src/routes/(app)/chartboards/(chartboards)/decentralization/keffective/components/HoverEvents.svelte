<script lang="ts">
    export let xScale : any;
    export let margin : any;
    export let width : any;
    export let height : any;
    export let hoveredEpoch : any;
    export let isHovered : any;
    export let maxEpoch : any;
    const handleMousemove = function (e : any) {
        hoveredEpoch = Math.round(xScale.invert(e.offsetX - margin.left));
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
    on:mousemove={handleMousemove}
    on:mouseleave={handleMouseleave}
/>

<line
    class="line-format"
    x1={xScale(hoveredEpoch)}
    x2={xScale(hoveredEpoch)}
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