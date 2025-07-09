<script lang="ts">

	// imports
	import Heading from '$lib/shared/ui/heading.svelte'
	import Overlay from '$lib/shared/ui/overlay.svelte'
	
	// define donut charts on page
	import PercStakedAda from './perc_staked_ada/PercStakedAda.svelte'
	import HbarStakeFlow from './hbar_stake_flow/HbarStakeFlow.svelte'

	// // import data
	export let data : any;
	const minEpochStart = 40;

    // Preprocessing setup
    // let keffData = data.keffData[0].keffdata;
    let stakeFlowData = data.stakeFlowData;
	let delegationPrctData = data.delegationPrctData[0].chartdata.delegation_prcnt; // will start from very beginning
	// let delegationPrctData = delegationPrctDataAll.slice(minEpochStart); //sliced from minEpochStart (say 40) to the end of the object array.
	// console.log("delegationPrctData", delegationPrctData)
	
</script>




<svelte:head>
	<title>Stake Flow</title>
</svelte:head>

<Heading>Stake Flow</Heading>


<main>
	<Overlay />
	
	<PercStakedAda {delegationPrctData} />

	<HbarStakeFlow {delegationPrctData} {stakeFlowData} />

</main>



<style>



</style>