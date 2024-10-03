<script lang="ts">

	// imports
	import Heading from '$lib/shared/ui/heading.svelte'
	// import Overlay from '$lib/shared/ui/overlay.svelte'
	
	// define donut charts on page
	import DonutGroupStakeChart from './donut_group_stake/DonutGroupStakeChart.svelte'
	
	// import data
	export let data : any;
	// console.log(data,"data donut page check")


	//*************************/
	//Donut Group Stake
	//*************************/

	// data preprocessing setup
	let donutData = data.groupStakeDonutData[0].chartdata;
	let curMAVData = data.mavData;
	let maxEpochData = data.epochData[data.epochData.length - 1].epoch;
	
	// console.log(donutData,"donutData +page check")
	// console.log(curMAVData,"curMAVData +page check")

	
</script>




<svelte:head>
	<title>Donut Shop</title>
</svelte:head>

<Heading>Group Stake Donut</Heading>


<main>
	<!-- <Overlay /> -->
	
	<DonutGroupStakeChart {donutData} {curMAVData} {maxEpochData}/>

</main>

<!-- {@debug DonutGroupStakeChart} -->

<style>



</style>