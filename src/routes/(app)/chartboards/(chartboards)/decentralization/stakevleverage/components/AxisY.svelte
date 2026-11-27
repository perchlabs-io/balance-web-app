<script lang="ts">
	interface Props {
		width: any;
		windowWidth: any;
		yScale: any;
		yScaleZoom: any;
		margin: any;
	}

	let { width, windowWidth, yScale, yScaleZoom, margin }: Props = $props();

	const formatter = new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumSignificantDigits: 3
	});

	let yTicks: any = $derived(yScaleZoom ? yScaleZoom.ticks(7) : yScale.ticks(7));

	const firstDigitStr = String(yTicks)[0];
</script>

{#each yTicks as tick}
	{#if String(tick)[0] === '1' || String(tick)[0] === '3' || String(tick)[0] === '6'}
		<text
			class="axis-format"
			x="0"
			dx="0"
			y={yScaleZoom ? yScaleZoom(tick) : yScale(tick)}
			text-anchor="end"
			alignment-baseline="middle">₳ {formatter.format(tick)}</text
		>

		<line
			class="line-format"
			x1="12"
			y1={yScaleZoom ? yScaleZoom(tick) : yScale(tick)}
			x2={width}
			y2={yScaleZoom ? yScaleZoom(tick) : yScale(tick)}
		/>
	{/if}

	{#if windowWidth > 650}
		<text
			class="axis-format"
			y={margin.left * -1 + 10}
			x={margin.left * -1 - 200}
			transform="rotate(270)"
			letter-spacing="1px"
			>Stake
		</text>
	{/if}
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
