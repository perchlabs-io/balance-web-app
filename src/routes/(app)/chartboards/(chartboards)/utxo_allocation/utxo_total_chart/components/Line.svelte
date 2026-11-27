<script lang="ts">
	import { line } from 'd3-shape';
	interface Props {
		data: any;
		xScale: any;
		yScale: any;
		xScaleZoom: any;
		yScaleZoom: any;
		color: any;
		hoveredEpoch: any;
	}

	let { data, xScale, yScale, xScaleZoom, yScaleZoom, color, hoveredEpoch }: Props = $props();
	let dataBeforeHover = $derived(data.filter((d: any) => d.epoch <= hoveredEpoch));
	let dataAfterHover = $derived(data.filter((d: any) => d.epoch >= hoveredEpoch));
	let lineGenerator = $derived(
		line()
			.x((d: any) => (xScaleZoom ? xScaleZoom(d.epoch) : xScale(d.epoch)))
			.y((d: any) => (yScaleZoom ? yScaleZoom(d.high) : yScale(d.high)))
	);
</script>

<path
	d={lineGenerator(dataBeforeHover)}
	stroke={color}
	fill="transparent"
	stroke-width="2.5"
	clip-path="url(#c)"
/>

<path
	d={lineGenerator(dataAfterHover)}
	stroke={color}
	fill="transparent"
	stroke-width="2.5"
	opacity=".15"
	clip-path="url(#c)"
/>
