<script lang="ts">
	import { colorTheme } from '$lib/stores/mychart';
	import { browser } from '$app/environment'

	export let auto = true
	export let ariaLabel = 'toggle menu'
	
	

	export let onClick = () => {

		auto = !auto


	}
	
  </script>
  
  <button on:click={onClick} aria-expanded={auto} aria-label={ariaLabel}>
		<svg
			class:auto
            width="32" 
            height="32"
            aria-hidden="true" 
            viewBox="0 0 24 24" 
            
        >
            <mask class="moon" id="moon-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <circle cx="24" cy="10" r="6" fill="black" />
            </mask>
            <circle
                class="sun"
                cx="12"
                cy="12"
                r="6"
                mask="url(#moon-mask)"
                fill="currentColor"
            />
            <g class="sun-beams" stroke="currentColor" stroke-width="2px">
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
        </svg>
  </button>
  
  <style>
	:root {
	  --transition-duration: 400ms;
	  --transition-duration-long: 0.4s;
	  --ease-elastic-3: cubic-bezier(0.5, 1.25, 0.75, 1.25);
	  --ease-elastic-4: cubic-bezier(0.5, 1.5, 0.75, 1.25);
	  --ease-3: cubic-bezier(0.25, 0, 0.3, 1);
	  --ease-out-5: cubic-bezier(0, 0, 0, 1);


	}
  
	button {
	  cursor: pointer;
	  display: flex;
	  align-items: center;
	  overflow: hidden;
	  padding: 8%;
	  /* border-width: 0px;
	  margin-top: -2px; */
	  
	  
	}
  
	svg {
	  transition: transform var(--transition-duration);
	  color: var(--clr-txt);
	}
  
	.top {
	  stroke-dasharray: 40 160;
	  transition: stroke-dashoffset var(--transition-duration);
	}
  
	.middle {
	  transform-origin: 50%;
	  transition: transform var(--transition-duration);
	}
  
	.bottom {
	  stroke-dasharray: 40 85;
	  transition: stroke-dashoffset var(--transition-duration);
	}
  
	.open {
	  transform: rotate(45deg);
	}
  
	.open .top,
	.open .bottom {
	  stroke-dashoffset: -64px;
	}
  
	.open .middle {
	  transform: rotate(90deg);
	}




	svg .moon,
	svg .sun,
	svg .sun-beams {
		transform-origin: center center;
	}

	.dark .sun {
		transform: scale(1.75);
	}

	.dark .sun-beams {
		opacity: 0;
	}

	.dark .moon > circle {
		transform: translateX(-7px);
	}

	/* @media (max-width: 650px) {

		button {
			cursor: pointer;
			display: flex;
			align-items: center;
			overflow: hidden;
			padding: 6%;
			border-width: 0px;
			margin-top: 3px;
			
			
		}


	} */

	@supports (cx: 1) {
		.dark .moon > circle {
			transform: translateX(0);
			cx: 17;
		}
	}

	@media (prefers-reduced-motion: no-preference) {

		

		svg .sun {
			transition: transform var(--transition-duration-long)
				var(--ease-elastic-3);
		}

		svg .sun-beams {
			transition: transform var(--transition-duration-long)
					var(--ease-elastic-4),
				opacity var(--transition-duration-long) var(--ease-3);
		}

		svg .moon > circle {
			transition: transform calc(var(--transition-duration-long) / 2)
				var(--ease-out-5);
		}

		@supports (cx: 1) {
			svg .moon > circle {
				transition: cx calc(var(--transition-duration-long) / 2)
					var(--ease-out-5);
			}
		}

		.dark .sun {
			transform: scale(1.75);
			transition-timing-function: var(--ease-3);
			transition-duration: calc(var(--transition-duration-long) / 2);
		}

		.dark .sun-beams {
			transform: rotateZ(-25deg);
			transition-duration: calc(var(--transition-duration-long) / 3);
		}

		.dark .moon > circle {
			transition-delay: calc(var(--transition-duration-long) / 2);
			transition-duration: var(--transition-duration-long);
		}

		@media (prefers-color-scheme: dark) {
			.auto .sun {
				transform: scale(1.75);
			}

			.auto .sun-beams {
				opacity: 0;
			}

			.auto .moon > circle {
				transform: translateX(-7px);
			}

			@supports (cx: 1) {
				.auto .moon > circle {
					transform: translateX(0);
					cx: 17;
				}
			}

			.auto .sun {
				transform: scale(1.75);
				transition-timing-function: var(--ease-3);
				transition-duration: calc(var(--transition-duration-long) / 2);
			}

			.auto .sun-beams {
				transform: rotateZ(-25deg);
				transition-duration: calc(var(--transition-duration-long) / 3);
			}

			.auto .moon > circle {
				transition-delay: calc(var(--transition-duration-long) / 2);
				transition-duration: var(--transition-duration-long);
			}
		}
	}

  </style>