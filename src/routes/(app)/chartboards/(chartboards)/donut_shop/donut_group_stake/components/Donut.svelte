<script lang="ts">
   import { run } from 'svelte/legacy';

    import { onMount } from 'svelte';
    import * as d3 from 'd3';

   interface Props {
      data: Array<{ label: string; value: number }>;
      width: number;
      height: number;
   }

   let { data = $bindable(), width, height }: Props = $props();


    //donut parameterization / preprocessing
    let radius = $state(Math.min(width, height) / 2);
    let innerRadius = $state(radius * 0.6);
    let outerRadius = $state(radius * 1.0);
    const padAngle = 0.02;
    const cornerRadius = 3;
    const tooltipOffset = 20;
    const radiusPopoutPadding = 1.05;	//[%/100] e.g. 105%/100 = 1.05

    let pie: any = $state();
    let arc: any = $state();
    let pie_data: any = $derived(pie(data));
    let arc_data: any = $derived(arc(pie_data));
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

    run(() => {
      data = data;
   });
    
    run(() => {
      radius = Math.min(width, height) / 2;
   }); 
    run(() => {
      innerRadius = radius * 0.6;
   });
    run(() => {
      outerRadius = radius * 1.0;
   });
    

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