<script>
	import { categories, chartBoards, github, matrix, twitter, youtube } from '$lib/api/config'
	import Newsletter from '$lib/shared/ui/newsletter.svelte'
</script>

<footer>
	<div class="categories">
		<p>Articles</p>
		<ul>
			{#each Object.entries(categories) as [slug, category]}
				<li>
					<a href="/categories/{slug}">{category}</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="chartboards">
		<p>Chart Boards</p>
		<ul>
			{#each Object.entries(chartBoards) as [slug, chartboard]}
				<li>
					<a href="/chartboards/{slug}">{chartboard}</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="api">
		<p>Public API</p>
		<ul>
			<li><a href="/api/groupdata.json" target="_blank" rel="noreferrer">Pool Group List</a></li>
			<li><a href="/api/mavdata.json" target="_blank" rel="noreferrer">Cardano MAV Detail</a></li>
			<li><a href="/api/groupleverage.json" target="_blank" rel="noreferrer">Group Stake v Leverage</a></li>
			
			
		</ul>
	</div>

	

	<div class="info">
		<p>Info</p>
		<ul>
			<li><a href="/about">About</a></li>
			<li><a href="/faq">FAQ</a></li>
			<li><a href="https://pool.pm/a43ceac028a673e9f8611de0f683c70fdcadde560f28c2fb8cfabc81" target="_blank" rel="noreferrer">BALNC Pool</a></li>
			<!--<li><a href="/uses">Uses</a></li>-->
		</ul>
	</div>

	<div class="follow">
		<p>Follow</p>
		<ul>
			<li><a href="/newsletter">Newsletter</a></li>
			<!--<li><a href="/rss.xml" target="_blank">RSS</a></li>-->
			<!--<li><a href={youtube} target="_blank" rel="noreferrer">YouTube</a></li>-->
			<li><a href={twitter} target="_blank" rel="noreferrer">𝕏</a></li>
			<li><a href={matrix} target="_blank" rel="noreferrer">Matrix</a></li>
		</ul>
	</div>

	

	

	<figure>
		<div class="decorative" >
		
		<span>
			<!--
			{#await import('./SpaceMan.svelte') then Module}
			<Module.default />
			{/await}
			-->
			<div class="newsletter">
				<h2>Subscribe for updates</h2>
				<Newsletter />
				<p>
					Catch the latest highlights on <a href={twitter} target="_blank" rel="noreferrer">𝕏</a> .
				</p>
			</div>
		</span>

		</div>
		
	</figure>
</footer>

<style>
	footer {
		display: grid;
		grid-template-columns: repeat(14, [column-start] 1fr);
		/* column-gap: var(--spacing-24); */
		/* row-gap: var(--spacing-16); */
		margin-top: var(--spacing-178);
		
		padding: var(--spacing-32);
		background-color: var(--ba-clr-footer-bg);
		border-top: 1px solid var(--clr-menu-border);
		border-left: 1px solid var(--clr-menu-border);
		/*border-radius: var(--rounded-20) var(--rounded-20) 0 0;*/
	}
	footer > * {
		grid-column: column-start 1 / span 13;
	}
	footer p {
		font-weight: 700;
	}
	footer ul {
		width: max-content;
		display: grid;
		grid-template-rows: repeat(4, 1fr);
		grid-auto-flow: column;
		column-gap: var(--spacing-32);
		row-gap: var(--spacing-16);
		margin-top: var(--spacing-16);
		
	}
	footer li a {
		font-weight: inherit;
		color: var(--clr-footer-txt);
	}
	footer li a:hover {
		color: var(--clr-primary);
	}
	
	footer figure {
		max-width: 500px;
		display: grid;
		
	}
	footer figure > * {
		grid-column: 1 / 1;
		grid-row: 1 / 1;
	}
	footer figure .decorative {
		width: 100%;
		height: 100%;
		padding-bottom: 50px;
		
	}
	
	.newsletter p {
		color: var(--clr-hero-txt);
	}
	.newsletter h2 {
		font-size: var(--font-24);
	}
	
	@media (min-width: 860px) {
		footer figure {
			grid-area: 1 / col8-start / last-line / 9;
		}
		footer .categories {
			grid-column: column-start 1 / span 3;
			
		}
		footer .chartboards {
			grid-column: column-start 4 / span 3;
		}
		footer .api {
			grid-column: column-start 1 / span 6;
		}
		footer .info {
			grid-column: column-start 9 / span 3;
			
		}
		footer .follow {
			grid-column: column-start 12 / span 2;
		}
	}
	@media (min-width: 1240px) {
		footer ul {
			width: auto;
			column-gap: 0;
		}
	}
	@media (max-width: 650px) {
		footer {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			
			row-gap: var(--spacing-42);
			margin-top: var(--spacing-178);
			
			padding: var(--spacing-32);
			background-color: var(--ba-clr-footer-bg);
			border-top: 1px solid var(--clr-menu-border);
			border-left: 1px solid var(--clr-menu-border);
			/*border-radius: var(--rounded-20) var(--rounded-20) 0 0;*/
		}
		

		footer li a {
			font-size: var(--font-14);
			font-weight: inherit;
			color: var(--clr-footer-txt);
		}
		footer p {
			font-weight: 700;
			font-size: var(--font-16);
		}
		.newsletter h2 {
			font-size: var(--font-22);
		}
		.newsletter p {
			font-size: var(--font-14);
			color: var(--clr-hero-txt);
		}
		
	}
</style>