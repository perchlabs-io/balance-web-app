<script lang="ts">
	import { colorTheme } from '$lib/stores/mychart';
    import { onMount } from "svelte";
	import ThemeToggleIcon from './animations/themeToggleIcon.svelte'
	
    
    export let auto = true


	export let onClick = () => {

        if($colorTheme == '🌛 Night') {

            auto = !auto

            let selectedTheme = '☀️ Daylight'

            const htmlElement = document.documentElement
            htmlElement.dataset.theme = selectedTheme
            localStorage.theme = selectedTheme

            colorTheme.set(selectedTheme)

            

        } else {

            auto = !auto

            let selectedTheme = '🌛 Night'

            const htmlElement = document.documentElement
            htmlElement.dataset.theme = selectedTheme
            localStorage.theme = selectedTheme

            colorTheme.set(selectedTheme)

            

        }

	}

    const themeCheck = () => {
        if($colorTheme == '🌛 Night') {

        auto = !auto

        }
	};

    onMount(() => {
        themeCheck();

    });

   

</script>




<div class="container">
    <div class="shape">
	
			
			<ThemeToggleIcon {auto} {onClick} />
		
    
    </div>
</div>

<style>
	.container {
		width: 35px;
		height: 35px;
	}

    .container :global(.shpae) {
        height: 100%;
		position: relative; 
        
		
	}
	
	@media (max-width: 650px) {
		.container {
		width: 24px;
		height: 24px;
	}
	}


	
	
</style>
