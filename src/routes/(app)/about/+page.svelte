<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte'
	import {fade} from 'svelte/transition'
	import Overlay from '$lib/shared/ui/overlay.svelte'
	import { onMount } from "svelte";
		
		let isExpanded = false
	
		function clickHandler() {
			isExpanded = !isExpanded
		}


		const goTop = () => {
			document.body.scrollIntoView();
		}

		onMount(() => {
        	goTop();

    	});
		
</script>

<svelte:head>
	<title>About</title>
	<meta
    property="og:image"
    content="https://balance-social-image.vercel.app/api/og"
  	/>
</svelte:head>

<Heading>About</Heading>


<main>
	<!-- <Overlay /> -->

	<section class="heroheader">
		<div class="inputbox">
			<div class="title">
				<h2>Summary</h2>
			</div>
			<div class="divider" />
			<div class="detail">
				<p>BALANCE is a blockchain research & intelligence platform dedicated to supporting the Cardano Blockchain Ecosystem.  Through in depth research and carefully crafted data visualizations, BALANCE provides the Cardano Community with network intelligence critical to building a better tomorrow.</p>
			</div>
		</div>
	</section>

	<section class="heroheader">
		<h2 class="heroheadertext">Team</h2>
		<div class="teambox">
			<div class="memberbox">
				<h4 class="membername">Nicholas Gilbert</h4>
				<!-- <div class="memberdivider" /> -->
				<div class="memberpic">
					<img style="border-radius: 0;" src="./assets/NG_profile_pic.png" alt="Nicholas Gilbert">
				</div>
				<p class="membertwitter"><strong>Twitter:</strong>&emsp; <a href="https://twitter.com/GilbertStClr" target="_blank" rel="noopener noreferrer">&emsp; @GilbertStClr</a></p>
				<p class="membertitle"><strong>Title:</strong>&emsp;&emsp;&nbsp;&nbsp;&nbsp; Founder & Co-Owner</p>
				<div class="memberdivider" />
				<p class="memberdetail">Nicholas brings a robust set of skills and knowledge gained through 15+ years of implementing financials solutions across many different business domains.  Driven by the prospect of greater efficiency, transparency, and stability through modern technology, Nicholas strives to help businesses & communities alike in leveraging technology to elevate themselves to better serve their customers / community.  Cardano was a natural choice for Nicholas as he started his crypto journey in 2021 given the strong alignment of beliefs and work ethic with the Cardano Community.</p>
			</div>

			<div class="memberbox2">
				<h4 class="membername">@TheStophe</h4>
				<!-- <div class="memberdivider" /> -->
				<div class="memberpic">
					<img style="border-radius: 0;" src="./assets/cgarant_profile.png" alt="@TheStophe">
				</div>
				<p class="membertwitter"><strong>Twitter:</strong> <a href="https://twitter.com/TheStophe" target="_blank" rel="noopener noreferrer">&emsp; @TheStophe</a></p>
				<p class="membertitle" ><strong>Title:</strong>&emsp;&emsp;&nbsp;&nbsp;&nbsp; Co-Owner</p>
				<div class="memberdivider" />
				<p class="memberdetail">Christophe has about a decades worth of experience in mechanical, electro-mechanical, and hydraulic fly-by-wire aerospace systems. He is well versed in Systems Engineering and Safety for new designs, integration & testing, production, and sustainment. He currently has crossed over into the software world working on flight control and autonomous systems, mainly requirements verification and formal testing. His affinity for quality design and flight critical system safety has naturally brought him to Cardano because of the engineering, first principles, Haskell formal testing and quality assurance design ethos. He has been in crypto since 2017 and Cardano since 2018. He considers himself part of the Cardano-Ergo  Community.</p>
			</div>

		</div>

	</section>

	<section class="heroheader">
		<h2 class="heroheadertext">Key Contributor</h2>
		<div class="contributor">
			<div class="contributorbox">
			
				<h4 class="contributorname">Dr. Michael Liesenfelt <a href="https://twitter.com/DrLiesenfelt" target="_blank" rel="noopener noreferrer">&emsp; @DrLiesenfelt</a></h4>
				
				<div class="contributordivider" />
				<div class="contributordetail">
					<p>Dr. Liesenfelt’s contribution to BALANCE has been instrumental from the beginning.  His unique ability to translate clear and concise analysis using deep scientific research methodologies allows BALANCE to produce more impactful data visualizations.  He also dedicates his time to User Acceptance Testing to help ensure BALANCE provides the highest level product & service to the community.  Thank you Dr. Liesenfelt for all that you do!! </p>
				</div>
			</div>
			<div class="contributorbox2">
				
				<h4 class="contributorname">Cardano Foundation  <a href="https://twitter.com/Cardano_CF" target="_blank" rel="noopener noreferrer">&emsp; @Cardano_CF</a></h4>
				
				<div class="contributordivider" />
				<div class="contributordetail">
					<p>On epoch 388, the Cardano Foundation selected BALNC stake pool as a CF Delegation recipient in recognition of the outstanding contribution BALANCE provides to the Cardano Ecosystem.  BALANCE and its affiliate stake pool [BALNC] are very proud to have received this delegation grant.  The CF Delegation grant has afforded BALANCE the opportunity to build a more performant & intuitive platform ensuring the team’s ability to deliver quality research and analytics for years to come.</p>
				</div>
			</div>
		</div>

	</section>


</main>

<style>
	.heroheader {
		
		
		margin-top: var(--spacing-64);
		padding-top: var(--spacing-18);
		padding-bottom: var(--spacing-18);
		
	}
	.heroheadertext {
		text-align: left;
		display: flex;
		margin-bottom: var(--spacing-32);
		margin-left: var(--spacing-8);
		
	}
	.inputbox {
		display: grid;
		display: flex;
		
		border-radius: 0;
		
		
	}
	
	.title {
		
		font-weight: 700;
		padding-bottom: var(--spacing-16);
		margin-left: var(--spacing-8);
		
	}
	.detail {
		color: var(--clr-card-txt);
		gap: var(--spacing-16);
		padding: var(--spacing-18);
		
	}
	.divider {
		
		border-bottom: 2px solid var(--clr-primary);
		
	}
	.teambox {
		display: grid;
		display: flex;
		row-gap: var(--spacing-32);
	
		
	}
	.contributor {
		display: grid;
		display: flex;
		row-gap: var(--spacing-32);
	
		
	}
	.memberbox {
		display: grid;
		
		border-radius: 0;
		
		
	}
	.memberbox2 {
		display: grid;
		
		border-radius: 0;
		
		
	}

	.membername {
		font-weight: 700;
		font-size: var(--font-20);
		padding: var(--spacing-16);
		line-height: 30px;
		
		
	}
	.memberpic {
		display: block;
  		margin-left: auto;
  		margin-right: auto;
		margin-bottom: var(--spacing-16);
  		width: 70%;
		padding: var(--spacing-16);
		
		
	}
	.memberdivider {
		
		border-bottom: 2px solid var(--clr-primary);
		
		
	}
	.memberdetail {
		color: var(--clr-card-txt);
		gap: var(--spacing-16);
		padding: var(--spacing-18);
		
	}
	.membertwitter {
		padding-left: var(--spacing-18);
		
		
	}
	.membertitle {
		padding-left: var(--spacing-18);
		margin-bottom: var(--spacing-16);
		
	}
	.contributorbox {
		display: grid;
		
		border-radius: 0;
		
		margin-bottom: var(--spacing-24);
		
	}
	.contributorbox2 {
		display: grid;
		
		border-radius: 0;
		
		
	}
	.contributorname {
		font-weight: 700;
		font-size: var(--font-20);
		padding: var(--spacing-16);
		line-height: 30px;
		
		
	}
	.contributordivider {
		
		border-bottom: 2px solid var(--clr-primary);
		
		
	}
	.contributordetail {
		color: var(--clr-card-txt);
		gap: var(--spacing-16);
		padding: var(--spacing-18);

		
	}
	
	

	@media (min-width: 1160px) {

		.inputbox {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
		}
		.title {	
			grid-column: column-start 1 / span 12;
		}
		.detail {
			grid-column: column-start 2 / span 10;
		}
		.divider {
			grid-column: column-start 1 / span 12;
				
		}
		.teambox {
			display: grid;
			column-gap: var(--spacing-64);
			grid-template-columns: repeat(12, [column-start] 1fr);
		}
		.memberbox{
			grid-column: column-start 2 / span 5;
		}
		.memberbox2{
			grid-column: column-start 7 / span 5;
		}
		.memberdetail {
			min-height: 550px;
		
		}
		.contributor {
			display: grid;
			column-gap: var(--spacing-64);
			grid-template-columns: repeat(12, [column-start] 1fr);
		}
		.contributorbox{
			grid-column: column-start 1 / span 12;
		}
		.contributorbox2{
			grid-column: column-start 1 / span 12;
		}
		.contributordetail {
		
		gap: var(--spacing-16);
		padding: var(--spacing-18);
		margin-left: 95px;
		margin-right: 95px;
		
		}	
		
		


	}

	@media (max-width: 1160px) {
		.inputbox {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
		}
		.title {	
			grid-column: column-start 1 / span 12;
		}
		.detail {
			grid-column: column-start 2 / span 10;
		}
		.divider {
			grid-column: column-start 1 / span 12;
				
		}
		.teambox {
			display: grid;
			column-gap: var(--spacing-64);
			grid-template-columns: repeat(12, [column-start] 1fr);
		}
		.memberbox{
			grid-column: column-start 2 / span 5;
		}
		.memberbox2{
			grid-column: column-start 7 / span 5;
		}
		.memberdetail {
			min-height: 750px;
		
		}
		.contributor {
			display: grid;
			column-gap: var(--spacing-64);
			grid-template-columns: repeat(12, [column-start] 1fr);
		}
		.contributorbox{
			grid-column: column-start 1 / span 12;
		}
		.contributorbox2{
			grid-column: column-start 1 / span 12;
		}
		.contributordetail {
		
		gap: var(--spacing-16);
		padding: var(--spacing-18);
		margin-left: 95px;
		margin-right: 95px;
		
		}	

	}

	@media (max-width: 960px) {
		.inputbox {
			display: grid;
			grid-template-columns: repeat(1, [column-start] 1fr);
		}
		.title {	
			grid-column: column-start 1 / span 1;
		}
		.detail {
			grid-column: column-start 1 / span 1;
		}
		.divider {
			grid-column: column-start 1 / span 1;
				
		}
		.teambox {
			display: grid;
			column-gap: var(--spacing-64);
			grid-template-columns: repeat(1, [column-start] 1fr);
		}
		.memberbox{
			grid-column: column-start 1 / span 1;
			margin-left: var(--spacing-32);
			margin-right: var(--spacing-32);
		}
		.memberbox2{
			grid-column: column-start 1 / span 1;
			margin-left: var(--spacing-32);
			margin-right: var(--spacing-32);
		}
		.memberpic {
			display: block;
			margin-left: auto;
			margin-right: auto;
			width: 50%;
			padding: var(--spacing-16);
		
		}
		.memberdetail {
			min-height: auto;
		
		}
		.contributor {
			display: grid;
			column-gap: var(--spacing-64);
			grid-template-columns: repeat(1, [column-start] 1fr);
		}
		.contributorbox{
			grid-column: column-start 1 / span 1;
		}
		.contributorbox2{
			grid-column: column-start 1 / span 1;
		}
		.contributordetail {
		
			gap: var(--spacing-16);
			padding: var(--spacing-18);
			margin-left: auto;
			margin-right: auto;
		
		}	




	}

	
	
</style>