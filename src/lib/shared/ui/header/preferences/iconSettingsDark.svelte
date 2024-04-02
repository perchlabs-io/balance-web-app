<script lang="ts">
	import {onMount} from 'svelte'
	import lottie, {type AnimationItem} from 'lottie-web'


	let iconSettingsButton: HTMLButtonElement
	let iconSettingsAnimation: AnimationItem

	import animationData1 from './iconSettings.json'

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

<button class=" animate-fade-in-once" bind:this={iconSettingsButton} ></button>
