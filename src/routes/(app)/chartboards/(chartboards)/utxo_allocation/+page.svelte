<script lang="ts">

	// imports
	import Heading from '$lib/shared/ui/heading.svelte'
	import Overlay from '$lib/shared/ui/overlay.svelte'
	
	// define charts on page
	import UTxOStackChart from './utxo_stack_chart/UTxOStackChart.svelte'
	import UTxODeltaChart from './utxo_delta_chart/UTxODeltaChart.svelte'
	import UTxOTotalChart from './utxo_total_chart/UTxOTotalChart.svelte'
	// import data
	export let data : any;
	


	//*************************/
	//Donut Group Stake
	//*************************/

	// data preprocessing setup
	
	let utxoStackData = data.utxoStackData;
	let utxoDeltaData = data.utxoDeltaData;
	let utxoTotalData = data.utxoTotalData;
	let epochData = data.epochData;
	
</script>




<svelte:head>
	<title>UTxO Allocation</title>
</svelte:head>

<Heading>UTxO Allocation</Heading>


<main>
	<!-- <Overlay /> -->


	<UTxOStackChart {utxoStackData} {epochData} />

	<UTxOTotalChart {utxoTotalData} {epochData} />

	<UTxODeltaChart {utxoDeltaData} {epochData} />

</main>


<style>



</style>