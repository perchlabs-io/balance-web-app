<script lang="ts">
                  
                 
  interface Props {
    width: any;
    yScale: any;
  }

  let { width, yScale }: Props = $props();
</script>

{#each yScale.ticks(10) as tick}
    <text
        class="axis-format"
        x="0"
        dx="-6"
        y={yScale(tick)}
        text-anchor="end"
        dominant-baseline="middle"
        font-weight=400
        font-size="12px"
    >
        {tick}
    </text>
    <line class="line-format" x1="10" x2={width} y1={yScale(tick)} y2={yScale(tick)} />
{/each}


<style>
    .axis-format {
      font-size: 12px;
      fill: var(--clr-txt);
  
    }
    .line-format {
      stroke: var(--clr-chart-line);
    }
    
    @media (max-width: 650px) {
        .axis-format {
        font-size: 10px;
        fill: var(--clr-txt);
            
        }
    }
  
  
</style>