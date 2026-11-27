<script lang="ts">
	import { area } from 'd3-shape';
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
	let AreaGenerator = $derived(
		area()
			.x((d: any) => xScale(d.epoch))
			.y0((d: any) => yScale(d.low))
			.y1((d: any) => yScale(d.high))
	);
</script>

<path
	d={AreaGenerator(dataBeforeHover)}
	stroke={color}
	fill={color}
	stroke-width="4"
	opacity=".55"
/>

<path
	d={AreaGenerator(dataAfterHover)}
	stroke={color}
	fill={color}
	stroke-width="4"
	opacity=".35"
/>
