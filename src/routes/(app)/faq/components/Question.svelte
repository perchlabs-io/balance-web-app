<script lang="ts">
	export let question : any;
	export let answer : any;
	export let link1url : any;
	export let link1text : any;
	export let id : any;

	import { fade, scale, slide } from 'svelte/transition';

	let showContent = ''

	const handleClick = (payload : any) => {
  
		showContent = payload === showContent ? '' : payload
	}
	
	const handleQAClose = () => {
		showContent = ''
		
	}
	
</script>

	<div {id} class="inputbox" on:mouseleave={handleQAClose}>
		<button class="question" type="button" on:click={() => handleClick(question)}>{question}</button>
		{#if showContent === question}
		<p class="answer" transition:slide|global={{ duration: 400 }}>
			{answer}
		</p>
		<a class="hyperlink" transition:slide|global={{ duration: 400 }} href={link1url} target="_blank" rel="noopener noreferrer">{link1text}</a>
		
		{/if}
	</div>

<style>

	.inputbox {
		display: grid;
		display: flex;
		align-items: center;
		
	}
	
	.question {
		font-weight: 700;
		margin: var(--spacing-8);
		padding: var(--spacing-16);
		/* background-image: var(--clr-card-bg); */
		background: var(--ba-clr-title-bg);
		border-top: 1px solid var(--clr-menu-border);
		border-left: 1px solid var(--clr-menu-border);
		border-radius: 0;
		/* box-shadow: var(--shadow-sm); */
		transition: transform 0.2s ease-in-out, box-shadow 0.3s ease,
			outline 0.1s ease;
		/*
      	I assume this prevents the card from flickering on hover
      	by triggering hardware-accelerated rendering
    	*/
		transform: translateZ(0);

	}
	.question:hover {
		transform: scale(1.01);
		box-shadow: var(--shadow-md), 0 0 0 3px var(--clr-primary);
	}
	.answer {
		gap: var(--spacing-16);
		padding-top: var(--spacing-16);
		padding-left: var(--spacing-18);
		padding-bottom: var(--spacing-16);

	}
	.hyperlink {
		padding-left: var(--spacing-18);
		padding-bottom: var(--spacing-16);
		
	}

	@media (min-width: 60px) {

		.inputbox {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
		}
		
		.question {
			
			grid-column: column-start 1 / span 12 ;
		}
		.answer {
			
			grid-column: column-start 2 / span 10 ;
		}
		.hyperlink {
			grid-column: column-start 2 / span 10 ;

		}
		
		
	}
	
</style>