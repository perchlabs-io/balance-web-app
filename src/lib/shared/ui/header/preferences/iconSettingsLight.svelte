<script lang="ts">
	import {onMount} from 'svelte'
	import lottie, {type AnimationItem} from 'lottie-web'
	import { browser } from '$app/environment';

	const defaultValue = '🌛 Night';
	//const initialValue = browser ? window.localStorage.getItem('theme') ?? defaultValue : defaultValue;
	const initialValue2 = browser ? document.documentElement.dataset.theme ?? defaultValue : defaultValue;

	let testTheme = initialValue2

	console.log('user theme', testTheme)
	

	let iconSettingsButton: HTMLButtonElement
	let iconSettingsAnimation: AnimationItem

	import animationData1 from './MgmtLight.json'

	let state = 'play';

	onMount(() => {
		iconSettingsAnimation = lottie.loadAnimation({
			container: iconSettingsButton,
			animationData: animationData1,
			loop: false,
			autoplay: false,
			
		})

		const lastFrame = iconSettingsAnimation.totalFrames - 1
		iconSettingsAnimation.goToAndStop(lastFrame, true);

		iconSettingsButton.addEventListener('click', () => {
  			if(state === 'play') {
				iconSettingsAnimation.playSegments([15, lastFrame], true);
    			state = 'pause';
  			} else {
    			iconSettingsAnimation.playSegments([15, lastFrame], true);
   				state = 'play';
  			}
		});

		return () => {
			iconSettingsAnimation.destroy()
		}
	})
</script>

<button class="button" bind:this={iconSettingsButton}></button>

<style>
	
	
	.button { 
		height: 24px; 
		width: 24px;
		filter: invert(43%) sepia(54%) saturate(4220%) hue-rotate(349deg) brightness(98%) contrast(88%);

		
		
	} 
	
</style>