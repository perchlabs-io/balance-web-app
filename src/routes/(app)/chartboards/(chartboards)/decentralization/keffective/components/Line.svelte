<script lang="ts">
	import { line } from 'd3-shape';
	interface Props {
		data: any;
		xScale: any;
		yScale: any;
		color: any;
		hoveredEpoch: any;
	}

	let { data, xScale, yScale, color, hoveredEpoch }: Props = $props();
	let dataBeforeHover = $derived(data.filter((d: any) => d.epoch <= hoveredEpoch));
	let dataAfterHover = $derived(data.filter((d: any) => d.epoch > hoveredEpoch));
	let lineGenerator = $derived(
		line()
			.x((d: any) => xScale(d.epoch))
			.y((d: any) => yScale(d.stat))
	);
</script>

<path d={lineGenerator(dataBeforeHover)} stroke={color} fill="transparent" stroke-width="3" />

<path
	d={lineGenerator(dataAfterHover)}
	stroke={color}
	fill="transparent"
	stroke-width="3"
	opacity=".35"
/>
