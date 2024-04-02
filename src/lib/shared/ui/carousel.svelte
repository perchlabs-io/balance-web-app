<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { flip } from 'svelte/animate';

  export let images : any;
  export let imageWidth = 800;
  export let imageSpacing = 20;
  export let speed = 500;
  //export let controlColor= '#444';
  //export let controlScale = '0.5';
  export let autoplay = false;
  export let autoplaySpeed = 5000;
  //export let displayControls = true;
  let interval : any;


  const rotateLeft = (e : any) => {
    const transitioningImage = images[images.length - 1]
    const imageElement = document.getElementById(transitioningImage.id)

    if (imageElement != null) {
      imageElement.style.opacity = "0";
      images = [images[images.length -1],...images.slice(0, images.length - 1)]
      setTimeout(() => (imageElement.style.opacity = "1"), speed);

    }
    
  }

  // const rotateRight = (e : any) => {
  //   const transitioningImage = images[0]
  //   if (transitioningImage !== null) {
  //   document.getElementById(transitioningImage.id).style.opacity = 0;
  //   images = [...images.slice(1, images.length), images[0]]
  //   setTimeout(() => (document.getElementById(transitioningImage.id).style.opacity = 1), speed);
  //   }
  // }


  const startAutoPlay = () => {
    if(autoplay){
      interval = setInterval(rotateLeft, autoplaySpeed)
    }
  }

  const stopAutoPlay = () => {
    clearInterval(interval)
  }

  if(autoplay){
    startAutoPlay()
  }

  onDestroy(() => {stopAutoPlay()})

  
  
</script>


<section>
  

  <div class="carousel-container">
    <div class="carousel-images">
      {#each images as image (image.id)}
      <img
        src={image.path}
        alt={image.id}
        id={image.id}
        style={`width:${imageWidth}px; margin: 0 ${imageSpacing}px;`}
        on:mouseover={stopAutoPlay}
        on:focus={stopAutoPlay}
        on:mouseleave={startAutoPlay}
        animate:flip={{duration: speed}}/>
      {/each}
    </div>
  </div>

  
</section>

<style>
  .carousel-container {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }
  .carousel-images {
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    -webkit-mask: linear-gradient(
      to right,
       transparent,
      black 2%,
      black 98%,
      transparent
    );
    mask: linear-gradient(
      to right,
      transparent,
      black 2%,
      black 98%,
      transparent
    );
  }
  .carousel-images:hover {
      box-shadow: 0 0 0 3px var(--clr-primary);

  }
  </style>
