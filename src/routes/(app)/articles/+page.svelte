<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte'
	import Posts from '$lib/shared/ui/posts.svelte'
	import type { PageServerData } from './$types'
	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Articles</title>
	<meta content="List of {data.posts.length} articles." name="description" />
	<meta
    property="og:image"
    content="https://balance-social-image.vercel.app/api/og?title=Articles"
  	/>
</svelte:head>

<Heading>Articles</Heading>

<Posts posts={data.posts}>
	{#snippet title()}
		<div class="container" >
			<h3>Archive</h3>
			<div>
				<span class="results">{data.posts.length}</span> results
			</div>
		</div>
	{/snippet}
</Posts>

<style>
	.container {
		display: flex;
		justify-content: space-between;
	}
	.results {
		font-weight: 700;
	}
</style>