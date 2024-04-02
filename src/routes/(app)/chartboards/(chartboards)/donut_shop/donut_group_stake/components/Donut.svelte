<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    export let data: Array<{ label: string; value: number }>;
    export let width: number;
    export var height: number;


    //donut parameterization / preprocessing
    let radius = Math.min(width, height) / 2;
    let innerRadius = radius * 0.6;
    let outerRadius = radius * 1.0;
    const padAngle = 0.02;
    const cornerRadius = 3;
    const tooltipOffset = 20;
    const radiusPopoutPadding = 1.05;	//[%/100] e.g. 105%/100 = 1.05

    let pie: any;
    let arc: any;
    let pie_data: any;
    let arc_data: any;
    let radius_recalc;



    pie = d3.pie()
        .value((d) => d.value)
        .sort((a, b) => b.value - a.value);

    arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .cornerRadius(cornerRadius)
        .padAngle(padAngle)
        .padRadius(innerRadius);

    $: data = data;
    $: pie_data = pie(data);
    $: radius = Math.min(width, height) / 2; 
    $: innerRadius = radius * 0.6;
    $: outerRadius = radius * 1.0;
    $: arc_data = arc(pie_data)

    //--- debugging ----//

   
</script>

<svg class='#chart'           
    width={width}
    height={width}
    >
        <g {width} {height}>
            <circle
                cx={width / 2} 
                cy={height / 2} 
                r={Math.min(width, height) / 2}            
                opacity={"0.75"}
                fill={'rgb(245, 188, 66, 0.9'}
                stroke={'rgb(245, 188, 66, 1'}
            ></circle>
            {#each pie_data as d, i}
                <path 
                    transform={`translate(${width/2}, ${height/2})`}
                    d={arc(d)} 
                    fill={colors[i % colors.length]} 
                    />
            {/each}
        </g>
</svg>

<style>
    #chart {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tooltip {
        font-weight: bold;
        font-size: 1em;
    }
</style>

<div id="chart"></div>