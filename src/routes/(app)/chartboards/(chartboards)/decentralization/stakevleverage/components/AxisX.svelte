<script lang="ts">
    
    export let height : any;
    export let width : any;
    export let xScale : any;
    export let xScaleZoom : any;
    export let margin : any;
    
  
    //let xTicks = [ 1,  10, 30, 60, 100, 200, 500, 1000];

    
	  
    let xTicks : any;
    $: xTicks = xScaleZoom ? xScaleZoom.ticks() : xScale.ticks()
	  
	
	  
  </script>
  
  <g  >
    {#each xTicks as tick}

    {#if String(tick)[0] === "1" || String(tick)[0] === "2" || String(tick)[0] === "5" }
          <text class="axis-format"
        x={xScaleZoom ? xScaleZoom(tick) : xScale(tick)} 
        y={height }
        dy="15"
        dominant-baseline="hanging"
        font-size="10px"
        font-weight=500
        text-anchor="middle"
        >{tick}</text>

        <line class="line-format"
        x1= {xScaleZoom ? xScaleZoom(tick) : xScale(tick)} 
        x2= {xScaleZoom ? xScaleZoom(tick) : xScale(tick)}
        y1= "0"
        y2={height + 7}
         />
        
    {/if} 

    <text class="axis-format"
          y={(height) + 50}
          x={(width) / 2 - 35} 
           
           font-size="12px"
           letter-spacing="1px"
           >Leverage
        </text>
        
        
    {/each}
  </g>


  <style>
    .axis-format {
      
      fill: var(--clr-txt);
  
    }
    .line-format {
      stroke: var(--clr-chart-line);
    }
  
  
  
  </style>