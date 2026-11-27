<script lang="ts">
	import { fade } from 'svelte/transition';
	import { windowWidth } from '$lib/stores/mychart';

	interface Props {
		data: any;
		xScale: any;
		yScale: any;
		xScaleZoom: any;
		yScaleZoom: any;
		margin: { top: number; left: number };
	}

	let { data, xScale, yScale, xScaleZoom, yScaleZoom, margin }: Props = $props();

	const formatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2
	});

	const x = $derived(xScaleZoom ? xScaleZoom(data.x) : xScale(data.x));
	const y = $derived(yScaleZoom ? yScaleZoom(data.y) : yScale(data.y));

	const leftOffset = $derived(
		//$windowWidth > 650 ? (data.x > 20 ? -158 : 75) : data.x > 20 ? -158 : 35
		$windowWidth > 650 ? (data.x > 20 ? -200 : 0) : data.x > 20 ? -158 : 35
	);
</script>

<div
	class="tooltip"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
	style="position: absolute; top: {margin.top + y + 5}px; left: {margin.left + x + leftOffset}px;"
>
	<p class="tooltip-item"><strong>Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp; {data.pg}</p>
	<p class="tooltip-item"><strong>Stake:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₳ {formatter.format(data.y)}</p>
	<p class="tooltip-item"><strong>Pledge:</strong>&nbsp;&nbsp;&nbsp; ₳ {formatter.format(data.pa)}</p>
</div>

<style>
	.tooltip {
		padding-left: var(--spacing-18);
		padding-right: var(--spacing-18);
		padding-top: var(--spacing-8);
		padding-bottom: var(--spacing-8);
		background: var(--clr-bg-opc);
		border-radius: var(--rounded-4);
		box-shadow: 0 0 0 2px var(--clr-primary);
		pointer-events: none;
		width: 235px;
	}
	.tooltip-item {
		line-height: 25px;
		color: var(--clr-card-txt);
		font-weight: 500;
		font-size: var(--font-14);
	}

	@media (max-width: 650px) {
		.tooltip {
			padding-left: var(--spacing-18);
			padding-right: var(--spacing-18);
			padding-top: var(--spacing-8);
			padding-bottom: var(--spacing-8);
			background: var(--clr-bg-opc);
			border-radius: var(--rounded-4);
			box-shadow: 0 0 0 2px var(--clr-primary);
			pointer-events: none;
			width: 195px;
		}
		.tooltip-item {
			line-height: 20px;
			color: var(--clr-card-txt);
			font-weight: 400;
			font-size: var(--font-12);
		}
	}
</style>
