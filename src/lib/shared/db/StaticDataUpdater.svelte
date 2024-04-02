<!-- FriendAdder.svelte -->
<script lang='ts'>
    import { db } from "./db";
    import { PUBLIC_BALANCE_API_TOKEN } from '$env/static/public';
    import { liveQuery } from "dexie";
    import { browser } from '$app/environment';
  
    
  
    let status = "";
    let type = "";
  
   
    
  
    async function updateGroupStakeData() {
      try {

        

        // Add the new friend!
        const response = await fetch('https://api.balanceanalytics.io/rpc/pool_leverage_sk', {
          method: 'get',
          
			    headers: {
            
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PUBLIC_BALANCE_API_TOKEN}`
          }
          
        });

        const gsData  = await response.json()
        

        console.log('Balance Data', gsData)
        
        const id = await db.staticdata.put({
          type: 'grpstakevlev',
          data: gsData
        });
  
        status = `Type ${type} successfully added. Got id ${id}`;

  
        
      } catch (error) {
        
      }
    }

   

      $: getGrpStake = liveQuery(async () => {
      //
      // Query Dexie's API
      //
      const getGrpStake = await db.staticdata
        .where('type')
        .equals('grpstakelev')
        .toArray();

      console.log('Get Local Data', getGrpStake)

      return getGrpStake;

      })


      



  </script>
  <div>
    <p>{status}</p>
    <fieldset>
      <legend>Add new friend</legend>
      
      <br/>
      
      <br />
      <button on:click={updateGroupStakeData}>Get Data from Server</button>
      <br />
      <p>{getGrpStake}</p>
    </fieldset>
  </div>