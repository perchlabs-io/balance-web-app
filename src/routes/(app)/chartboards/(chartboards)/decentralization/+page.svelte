<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte'
	import KeffChart from "./keffective/KeffChart.svelte";
	import LevChart from "./stakevleverage/LevChart.svelte";
	import Overlay from '$lib/shared/ui/overlay.svelte'
	
	
	export let data : any;

	//*************************/
	//Avg. Resulting Decentralization
	//*************************/
	let keffData = data.keffData[0].keffdata;

	//*************************/
	//Group Stake v. Leverage
	//*************************/
	let curMAVData = data.mavData;
	let selectedData = data.levData;
	let poolGroupData = data.groupData.pgl;
	let maxEpochData = data.epochData[data.epochData.length - 1].epoch;
	let minEpochData = data.epochData[0].epoch;


</script>

<svelte:head>
	<title>Decentralization</title>
</svelte:head>

<Heading>Decentralization</Heading>

<main>
	<!-- <Overlay /> -->

	<!-- This is a test comment to confirm automated deployment is working correctly  2-->

	<LevChart {curMAVData} {selectedData} {maxEpochData} {minEpochData} {poolGroupData}/>

	<KeffChart {keffData}/>

	

</main>
