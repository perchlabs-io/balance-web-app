<script lang="ts">
	// imports
	import Heading from '$lib/shared/ui/heading.svelte';
	// import Overlay from '$lib/shared/ui/overlay.svelte'

	// define donut charts on page
	import DonutGroupStakeChart from './donut_group_stake/DonutGroupStakeChart.svelte';

	interface Props {
		// import data
		data: any;
	}

	let { data }: Props = $props();

	//*************************/
	//Donut Group Stake
	//*************************/

	// data preprocessing setup
	let donutData = $derived(data.groupStakeDonutData[0].chartdata);
	let curMAVData = $derived(data.mavData);
	let maxEpochData = $derived(data.epochData[data.epochData.length - 1].epoch);
</script>

<svelte:head>
	<title>Donut Shop</title>
</svelte:head>

<Heading>Group Stake Donut</Heading>

<main>
	<!-- <Overlay /> -->

	<DonutGroupStakeChart {donutData} {curMAVData} {maxEpochData} />
</main>

<!-- {@debug DonutGroupStakeChart} -->

<style>
</style>
