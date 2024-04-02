<script lang="ts">
  import { fade } from 'svelte/transition';
  
  export let data : any;
  export let width : number;
  export let height : number;
  export let latestEpoch: any;
  export let latestEpochMAV: any;
  export let state: any;
  export let stateDetailed: any;
  export let stateCenter: any;
  export let buttonSelected: string;

  // console.log(data,"data tooltip check")
  // console.log(latestEpoch,"latestEpoch tooltip check")
  // console.log(latestEpochMAV,"latestEpochMAV tooltip check")

  let offsetHeader = 50;
  let offsetDetail = 40;
  let maxWidth = 759;
  let maxHeight = 759;
 
  const formatter = new Intl.NumberFormat('en-US', {
    //notation: "compact", maximumSignificantDigits: 3
    minimumFractionDigits: 0

  })

  // $: console.log(data,"tooltip data")
  // $: console.log(width,"tooltip width")
  // $: console.log(height,"tooltip height")
  // $: console.log(stateCenter, "stateCenter check")
  // $: console.log(stateDetailed, "stateDetailed check")
  // $: console.log(state,"state check")

  //scale factor for dynamic font size and spacing based on window size
  $: scaleFactor = Math.min((width/maxWidth),(height/maxHeight))

  //text size scaling notes
  //***variable text size***//
  //at max window size, desired font-size for header label, prcstake are 50, 40. The window size is 759. 50*(width/759).
  //when width is 759, 759/759 = 1. 1*50 is 50. When the window is 379.5/759 or width/759 = 25. this was the text shrinks with window size.

  let hoveredDataSubLabel: any;

  $: {
    switch (buttonSelected) {
      case 'stake':
        // console.log("stake button test good");
        hoveredDataSubLabel = `Stake: ₳ ${formatter.format(data?.data?.stake) ?? ''}`;
        break;
      case 'pledge':
        // console.log("pledge button test good");
        hoveredDataSubLabel = `Pledge: ₳ ${formatter.format(data?.data?.pledge) ?? ''}`;
        break;
      case 'pool':
        // console.log("pool button test good");
        hoveredDataSubLabel = `Pools: ${formatter.format(data?.data?.poolcount) ?? ''}`;
        break;
      case 'delegator':
        // console.log("delegator button test good");
        hoveredDataSubLabel = `Delegators: ${formatter.format(data?.data?.delegatecount) ?? ''}`;
        break;
      default:
        hoveredDataSubLabel = undefined;
        break;
    }
  }

  // console.log(hoveredDataSubLabel, "hoveredDataSubLabel tooltip test");




</script>


<!-- tooltip logic -->
<g class="tooltip" >
  {#if stateDetailed}
    <text class="tooltip-header" x={width/2-offsetDetail*3.25*scaleFactor} y={height/2-offsetDetail*(scaleFactor)*3} font-size={25*scaleFactor} text-anchor="left" >group: {data.data.label}</text>
    <text class="tooltip-header" x={width/2-offsetDetail*3.25*scaleFactor} y={height/2-offsetDetail*(scaleFactor)*2} font-size={25*scaleFactor} text-anchor="left" >stake: {data.data.prctstake}%</text>
    <text class="tooltip-header" x={width/2-offsetDetail*3.25*scaleFactor} y={height/2-offsetDetail*(scaleFactor)*1} font-size={25*scaleFactor} text-anchor="left" >stake: ₳ {formatter.format(data.data.stake)}</text>
    <text class="tooltip-header" x={width/2-offsetDetail*3.25*scaleFactor} y={height/2-offsetDetail*(scaleFactor)*0} font-size={25*scaleFactor} text-anchor="left" >pledge: ₳ {formatter.format(data.data.pledge)}</text>
    <text class="tooltip-header" x={width/2-offsetDetail*3.25*scaleFactor} y={height/2-offsetDetail*(scaleFactor)*-1} font-size={25*scaleFactor} text-anchor="left" >leverage: {data.data.leverage}</text>
    <text class="tooltip-header" x={width/2-offsetDetail*3.25*scaleFactor} y={height/2-offsetDetail*(scaleFactor)*-2} font-size={25*scaleFactor} text-anchor="left" >pool count: {data.data.poolcount}</text>
    <text class="tooltip-header" x={width/2-offsetDetail*3.25*scaleFactor} y={height/2-offsetDetail*(scaleFactor)*-3} font-size={25*scaleFactor} text-anchor="left" >delegate count: {formatter.format(data.data.delegatecount)}</text>
  {:else if stateCenter}
    <text x={width/2} y={height/2} font-size={60*scaleFactor} text-anchor="middle" fill="hsla(294, 100%, 45%, 1)" font-weight="bold">MAV: {latestEpochMAV}</text>
    <text x={width/2} y={height/2+60*(scaleFactor)} font-size={40*scaleFactor} text-anchor="middle" fill="hsla(294, 100%, 45%, 1)" font-weight="bold">Epoch {latestEpoch}</text>
    <text x={width/2} y={height/2+140*(scaleFactor)} font-size={20*scaleFactor} text-anchor="middle" fill="hsla(294, 100%, 45%, 1)" fill-opacity="0.5" font-style="italic">BalanceAnalytics.io</text>
    <text x={width/2} y={height/2+170*(scaleFactor)} font-size={20*scaleFactor} text-anchor="middle" fill="hsla(294, 100%, 45%, 1)" fill-opacity="0.5" font-style="italic">BALNC Pool</text>
  {:else if state}
    <text class="tooltip-detail" x={width/2} y={height/2} font-size={50*scaleFactor} text-anchor="middle">{data.data.label}</text>
    <text class="tooltip-detail" x={width/2} y={height/2+offsetHeader*(scaleFactor)} font-size={40*scaleFactor} text-anchor="middle">Stake {data.data.prctstake}%</text>
    <text class="tooltip-detail" x={width/2} y={height/2+40*(scaleFactor)*2} font-size={20*scaleFactor} text-anchor="middle">{hoveredDataSubLabel}</text>
  {:else }
    <text in:fade={{ delay: 500, duration: 1000 }} x={width/2} y={height/2} font-size={60*scaleFactor} text-anchor="middle" fill="var(--clr-txt" font-weight="bold">MAV: {latestEpochMAV}</text>
    <text in:fade={{ delay: 500, duration: 1000 }} x={width/2} y={height/2+60*(scaleFactor)} font-size={40*scaleFactor} text-anchor="middle" fill="var(--clr-txt" font-weight="bold">Epoch {latestEpoch}</text>
    <text in:fade={{ delay: 500, duration: 1000 }} x={width/2} y={height/2+140*(scaleFactor)} font-size={20*scaleFactor} text-anchor="middle" fill="var(--clr-txt" fill-opacity="0.5" font-style="italic">BalanceAnalytics.io</text>
    <text in:fade={{ delay: 500, duration: 1000 }} x={width/2} y={height/2+170*(scaleFactor)} font-size={20*scaleFactor} text-anchor="middle" fill="var(--clr-txt" fill-opacity="0.5" font-style="italic">BALNC Pool</text>

  {/if}

</g>


<style>
  .tooltip {
    padding-left: var(--spacing-18);
    padding-right: var(--spacing-18);
    padding-top: var(--spacing-8);
    padding-bottom: var(--spacing-8);
    background: var(--clr-bg-opc);
    border-radius: var(--rounded-4);
    box-shadow: 0 0 0 2px var(--clr-primary);
    
  }

  .tooltip-header {
    
    color: var(--clr-txt);
    fill: var(--clr-txt);
   
    
  }
  
  .tooltip-detail {
    
    color: var(--clr-txt);
    fill: var(--clr-txt);
    
    
  }

  
</style>