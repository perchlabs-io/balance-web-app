<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte'
	import {fade} from 'svelte/transition'
	import Question from './components/Question.svelte';
	import Overlay from '$lib/shared/ui/overlay.svelte'
	
	import faq from './components/faqs';
	import type { dataset_dev } from 'svelte/internal'
	const title = 'SvelteKit FAQ Page with SEO';
	
	const faqGen = faq['general']
	const faqGenCount = faq['general'].length

	const faqData = faq['dataBrowsing']
	const faqDataCount = faq['dataBrowsing'].length

	const faqLev = faq['groupStakeVLev']
	const faqLevCount = faq['groupStakeVLev'].length

	const faqAvg = faq['avgResultDec']
	const faqAvgCount = faq['avgResultDec'].length
	

</script>

<svelte:head>
	<title>FAQ</title>
</svelte:head>

<Heading>FAQ</Heading>


<main>
	<!-- <Overlay /> -->
		
		<section class="heroheader">
			<h3 class="heroheadertext">General Questions</h3>
			{#each faqGen as { question, answer, link1url, link1text }, index}
				<article class="qAndA" aria-posinset={index + 1} aria-setsize={faqGenCount}>
					<Question id={`question-${index + 1}`} {question} {answer} {link1url} {link1text} />
				</article>
			{/each}
		</section>

		<section class="heroheaderSub">
			<h3 class="heroheadertext">Data & Browsing Questions</h3>
			{#each faqLev as { question, answer, link1url, link1text }, index}
				<article class="qAndA" aria-posinset={index + 1} aria-setsize={faqLevCount}>
					<Question id={`question-${index + 1}`} {question} {answer} {link1url} {link1text} />
				</article>
			{/each}
		</section>

		<section class="heroheaderSub">
			<h3 class="heroheadertext">Group Stake vs Leverage Chart Questions</h3>
			{#each faqData as { question, answer, link1url, link1text }, index}
				<article class="qAndA" aria-posinset={index + 1} aria-setsize={faqDataCount}>
					<Question id={`question-${index + 1}`} {question} {answer} {link1url} {link1text} />
				</article>
			{/each}
		</section>

		<section class="heroheaderSub">
			<h3 class="heroheadertext">Average Resulting Decentralization Chart Questions</h3>
			{#each faqAvg as { question, answer, link1url, link1text }, index}
				<article class="qAndA" aria-posinset={index + 1} aria-setsize={faqAvgCount}>
					<Question id={`question-${index + 1}`} {question} {answer} {link1url} {link1text} />
				</article>
			{/each}
		</section>

		
	
</main>

<style>
	.heroheader {
		
		text-align: center;
		margin-top: var(--spacing-64);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		
	}
	.heroheaderSub {
		
		text-align: center;
		margin-top: var(--spacing-32);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		
	}
	.heroheadertext {
		text-align: left;
		display: flex;
		margin-bottom: var(--spacing-16);
		margin-left: var(--spacing-24);
		
	}
	.qAndA {
		text-align: left;
		margin-left: var(--spacing-16);
		margin-right: var(--spacing-16);
		
	}
	
	

	@media (min-width: 860px) {

		
	}
</style>