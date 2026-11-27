<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		data: any;
		width: number;
		height: number;
		latestEpoch: any;
		latestEpochMAV: any;
		hoverState: any;
		stateDetailed: any;
		stateCenter: any;
		buttonSelected: string;
	}

	let {
		data,
		width,
		height,
		latestEpoch,
		latestEpochMAV,
		hoverState,
		stateDetailed,
		stateCenter,
		buttonSelected
	}: Props = $props();

	let offsetHeader = 50;
	let offsetDetail = 40;
	let maxWidth = 759;
	let maxHeight = 759;

	const formatter = new Intl.NumberFormat('en-US', {
		//notation: "compact", maximumSignificantDigits: 3
		minimumFractionDigits: 0
	});

	//scale factor for dynamic font size and spacing based on window size
	let scaleFactor = $derived(Math.min(width / maxWidth, height / maxHeight));

	//text size scaling notes
	//***variable text size***//
	//at max window size, desired font-size for header label, prcstake are 50, 40. The window size is 759. 50*(width/759).
	//when width is 759, 759/759 = 1. 1*50 is 50. When the window is 379.5/759 or width/759 = 25. this was the text shrinks with window size.

	let hoveredDataSubLabel = $derived.by(() => {
		switch (buttonSelected) {
			case 'stake':
				return `Stake: ₳ ${formatter.format(data?.data?.stake) ?? ''}`;
			case 'pledge':
				return `Pledge: ₳ ${formatter.format(data?.data?.pledge) ?? ''}`;
			case 'pool':
				return `Pools: ${formatter.format(data?.data?.poolcount) ?? ''}`;
			case 'delegator':
				return `Delegators: ${formatter.format(data?.data?.delegatecount) ?? ''}`;
			default:
				return undefined;
		}
	});
</script>

<!-- tooltip logic -->
<g class="tooltip">
	{#if stateDetailed}
		<text
			class="tooltip-header"
			x={width / 2 - offsetDetail * 3.25 * scaleFactor}
			y={height / 2 - offsetDetail * scaleFactor * 3}
			font-size={25 * scaleFactor}
			text-anchor="left">group: {data.data.label}</text
		>
		<text
			class="tooltip-header"
			x={width / 2 - offsetDetail * 3.25 * scaleFactor}
			y={height / 2 - offsetDetail * scaleFactor * 2}
			font-size={25 * scaleFactor}
			text-anchor="left">stake: {data.data.prctstake}%</text
		>
		<text
			class="tooltip-header"
			x={width / 2 - offsetDetail * 3.25 * scaleFactor}
			y={height / 2 - offsetDetail * scaleFactor * 1}
			font-size={25 * scaleFactor}
			text-anchor="left">stake: ₳ {formatter.format(data.data.stake)}</text
		>
		<text
			class="tooltip-header"
			x={width / 2 - offsetDetail * 3.25 * scaleFactor}
			y={height / 2 - offsetDetail * scaleFactor * 0}
			font-size={25 * scaleFactor}
			text-anchor="left">pledge: ₳ {formatter.format(data.data.pledge)}</text
		>
		<text
			class="tooltip-header"
			x={width / 2 - offsetDetail * 3.25 * scaleFactor}
			y={height / 2 - offsetDetail * scaleFactor * -1}
			font-size={25 * scaleFactor}
			text-anchor="left">leverage: {data.data.leverage}</text
		>
		<text
			class="tooltip-header"
			x={width / 2 - offsetDetail * 3.25 * scaleFactor}
			y={height / 2 - offsetDetail * scaleFactor * -2}
			font-size={25 * scaleFactor}
			text-anchor="left">pool count: {data.data.poolcount}</text
		>
		<text
			class="tooltip-header"
			x={width / 2 - offsetDetail * 3.25 * scaleFactor}
			y={height / 2 - offsetDetail * scaleFactor * -3}
			font-size={25 * scaleFactor}
			text-anchor="left">delegate count: {formatter.format(data.data.delegatecount)}</text
		>
	{:else if stateCenter}
		<text
			x={width / 2}
			y={height / 2}
			font-size={60 * scaleFactor}
			text-anchor="middle"
			fill="hsla(294, 100%, 45%, 1)"
			font-weight="bold">MAV: {latestEpochMAV}</text
		>
		<text
			x={width / 2}
			y={height / 2 + 60 * scaleFactor}
			font-size={40 * scaleFactor}
			text-anchor="middle"
			fill="hsla(294, 100%, 45%, 1)"
			font-weight="bold">Epoch {latestEpoch}</text
		>
		<text
			x={width / 2}
			y={height / 2 + 140 * scaleFactor}
			font-size={20 * scaleFactor}
			text-anchor="middle"
			fill="hsla(294, 100%, 45%, 1)"
			fill-opacity="0.5"
			font-style="italic">BalanceAnalytics.io</text
		>
		<text
			x={width / 2}
			y={height / 2 + 170 * scaleFactor}
			font-size={20 * scaleFactor}
			text-anchor="middle"
			fill="hsla(294, 100%, 45%, 1)"
			fill-opacity="0.5"
			font-style="italic">BALNC Pool</text
		>
	{:else if hoverState}
		<text
			class="tooltip-detail"
			x={width / 2}
			y={height / 2}
			font-size={50 * scaleFactor}
			text-anchor="middle">{data.data.label}</text
		>
		<text
			class="tooltip-detail"
			x={width / 2}
			y={height / 2 + offsetHeader * scaleFactor}
			font-size={40 * scaleFactor}
			text-anchor="middle">Stake {data.data.prctstake}%</text
		>
		<text
			class="tooltip-detail"
			x={width / 2}
			y={height / 2 + 40 * scaleFactor * 2}
			font-size={20 * scaleFactor}
			text-anchor="middle">{hoveredDataSubLabel}</text
		>
	{:else}
		<text
			in:fade|global={{ delay: 500, duration: 1000 }}
			x={width / 2}
			y={height / 2}
			font-size={60 * scaleFactor}
			text-anchor="middle"
			fill="var(--clr-txt"
			font-weight="bold">MAV: {latestEpochMAV}</text
		>
		<text
			in:fade|global={{ delay: 500, duration: 1000 }}
			x={width / 2}
			y={height / 2 + 60 * scaleFactor}
			font-size={40 * scaleFactor}
			text-anchor="middle"
			fill="var(--clr-txt"
			font-weight="bold">Epoch {latestEpoch}</text
		>
		<text
			in:fade|global={{ delay: 500, duration: 1000 }}
			x={width / 2}
			y={height / 2 + 140 * scaleFactor}
			font-size={20 * scaleFactor}
			text-anchor="middle"
			fill="var(--clr-txt"
			fill-opacity="0.5"
			font-style="italic">BalanceAnalytics.io</text
		>
		<text
			in:fade|global={{ delay: 500, duration: 1000 }}
			x={width / 2}
			y={height / 2 + 170 * scaleFactor}
			font-size={20 * scaleFactor}
			text-anchor="middle"
			fill="var(--clr-txt"
			fill-opacity="0.5"
			font-style="italic">BALNC Pool</text
		>
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
