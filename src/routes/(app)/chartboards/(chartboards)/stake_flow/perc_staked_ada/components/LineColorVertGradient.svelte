
<script lang="ts">

    /*** imports ***/
    import { piecewise, interpolateHsl, color, curveMonotoneX, curveBasis } from 'd3';
    import { scaleLinear } from "d3-scale";
    import { max, min } from "d3-array";
    import { line } from "d3-shape";
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    /*** parameters ***/
    export let data : any;
    export let xScale : any;
    export let yScale : any;
    export let xScaleZoom : any;
    export let yScaleZoom : any;
    export let hoveredEpoch : any;

    /*** Dynamic Parameters ***/
    $: dataBeforeHover = data.filter((d : any) => (d.epoch) <= hoveredEpoch);
    $: dataAfterHover = data.filter((d : any) => (d.epoch) >= hoveredEpoch);
    // console.log("dataBeforeHover",dataBeforeHover)
    // console.log("hoveredEpoch",hoveredEpoch)

    // // lineGenerator for scaling
    // $: lineGenerator = line()
    //     .x((d : any) => xScaleZoom ? xScaleZoom(d.epoch) : xScale(d.epoch))
    //     .y((d : any) => yScaleZoom ? yScaleZoom(d.stat) : yScale(d.stat))
    //     .curve(curveBasis);

    // lineGenerator for scaling
    $: lineGenerator = line()
        .x((d : any) => xScale(d.epoch))
        .y((d : any) => yScale(d.stat))
        .curve(curveBasis);

    const params = {
        delay: 100,
        duration: 750,
        easing: cubicOut
    };

    // //*************************/
    // //Color Scale
    // //*************************/
    // const colorScale = scaleLinear()
    //     .domain([min(data, d => d.stat), max(data, d => d.stat)])
    //     .range(["#ff4f4f", "#72ff4f"]);

    // console.log("colorScale Test",colorScale(0.7))

    /***filtering and cleaning the data***/
    let x_data = data.map((d: any) => ({ x: d.epoch }));
    let y_data = data.map((d: any) => ({ y: d.stat }));
    // console.log("data",data)
    // console.log("x_data",x_data)
    // console.log("y_data",y_data)


</script>

    <defs>
        <linearGradient id="linearVertGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="10%" stop-color="hsla(128, 66%, 57%, 1)" />
            <stop offset="90%" stop-color="hsla(0, 99%, 63%, 1)"/>
        </linearGradient>
    </defs>
    
    <path
        d={lineGenerator(data)}
        stroke="url(#linearVertGradient)"
        fill="transparent"
        stroke-width="5.0"
        clip-path="url(#c)"
    />

<style>


</style>