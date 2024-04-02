<!-- FriendList.svelte --> 
<script>
    import { liveQuery } from "dexie";
    import { db } from "./db";
    import { browser } from '$app/environment';
    import { grpStakeData } from '$lib/stores/mychart';
  
    let searchValue = 'grpstakevlev';
  
    //
    // Query
    //
    $: staticdata = liveQuery(async () => {
      //
      // Query Dexie's API
      //
      const staticdata = await db.staticdata
        .where('type')
        .equals(searchValue)
        .toArray();

      const staticdata2 = JSON.stringify(staticdata[0].data)
      const staticdata3 = JSON.parse(staticdata2)
      const staticdata4 = await staticdata3[0].chartdata
      const staticdata5 = await staticdata4
      
      grpStakeData.set(staticdata5)

      console.log('Local Data Query', staticdata5)

      
  
      // Return result
      return staticdata2;
    });

    
  </script>
  <ul>
    {#if $staticdata}
      
        <li>{$staticdata}</li>
      
    {/if}
  </ul>