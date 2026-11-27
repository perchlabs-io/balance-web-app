<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte';
	import KeffChart from './keffective/KeffChart.svelte';
	import LevChart from './stakevleverage/LevChart.svelte';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	let keffData = $derived(data.keffData[0].keffdata);
	let curMAVData = $derived(data.mavData);
	let selectedData = $derived(data.levData);
	let poolGroupData = $derived(data.groupData.pgl);
	let maxEpochData = $derived(data.epochData[data.epochData.length - 1].epoch);
	let minEpochData = $derived(data.epochData[0].epoch);
</script>

<svelte:head>
	<title>Decentralization</title>
</svelte:head>

<Heading>Decentralization</Heading>

<main>
	<!-- This is a test comment to confirm automated deployment is working correctly  2-->

	<LevChart {curMAVData} {selectedData} {maxEpochData} {minEpochData} {poolGroupData} />

	<KeffChart {keffData} />
</main>
