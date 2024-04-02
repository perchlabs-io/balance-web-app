<script lang="ts">
    export let itemLabel : any;
    export let highlighted : any;
</script>
  
  
  
  <button class="autocomplete-items" class:autocomplete-active={highlighted} on:click>{@html itemLabel}</button>

  <style>
    .autocomplete-items {
      list-style: none;
      border-bottom: 2px solid var(--clr-txt);
      z-index: 0;
      /*position the autocomplete items to be the same width as the container:*/
      top: 100%;
      left: 0;
      right: 0;
      padding: 10px;
      cursor: pointer;
      border-radius: var(--rounded-4);
      background-color: var(--clr-card-bg2);
      color: var(--clr-card-txt);
      transition: all 0.2s ease-in-out;
    }
    
    .autocomplete-items:hover {
      /*when hovering an item:*/
      background-color: var(--clr-primary);
      color: var(--clr-bg);
    }
    
    .autocomplete-items:active {
      /*when navigating through the items using the arrow keys:*/
      background-color: DodgerBlue !important;
      color: #ffffff;
    }	
        
    .autocomplete-active {
      /*when navigating through the items using the arrow keys:*/
      background-color: DodgerBlue !important;
      color: #ffffff;
    }
    </style>