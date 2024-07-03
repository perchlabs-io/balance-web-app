import { BALANCE_API_TOKEN } from '$env/static/private';


export async function getChartData() {

    const response = await fetch('https://api.balanceanalytics.io/rpc/pool_leverage_sk', {
                method: 'get',
                
                headers: {
                  
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${BALANCE_API_TOKEN}`
                }
                
              });

              if (!response.ok) {
                throw new Error('💩 Could not fetch Balance data')
                }
        
              const chartData = await response.json()

              const staticdata2 = JSON.stringify(chartData)
              const staticdata3 = JSON.parse(staticdata2)
              const staticdata4 = await staticdata3[0].chartdata
              const staticdata5 = await staticdata4

              return staticdata5

              

};

export async function getStakeFlowData() {

  const response = await fetch('https://api.balanceanalytics.io/rpc/stake_flow', {
              method: 'get',
              
              headers: {
                
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BALANCE_API_TOKEN}`
              }
              
            });

            if (!response.ok) {
              throw new Error('💩 Could not fetch Balance data')
              }
      
            const chartData = await response.json()

            const staticdata2 = JSON.stringify(chartData)
            const staticdata3 = JSON.parse(staticdata2)
            const staticdata4 = await staticdata3[0].chartdata
            const staticdata5 = await staticdata4

            return staticdata5

            

};

export async function getMAVData() {

  const response = await fetch('https://api.balanceanalytics.io/rpc/mav_count_sk', {
              method: 'get',
              
              headers: {
                
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BALANCE_API_TOKEN}`
              }
              
            });

            if (!response.ok) {
              throw new Error('💩 Could not fetch Balance data')
              }
      
            const mavData = await response.json()

            const staticdata2 = JSON.stringify(mavData)
            const staticdata3 = JSON.parse(staticdata2)
            const staticdata4 = await staticdata3[0].mavdata
            const staticdata5 = await staticdata4
            

            return staticdata5

            

};

export async function getGroupStakeDonutData() {

  const response = await fetch('https://api.balanceanalytics.io/rpc/pool_group_stake_donut', {
              method: 'get',
              
              headers: {
                
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BALANCE_API_TOKEN}`
              }
              
            });

            if (!response.ok) {
              throw new Error('💩 Could not fetch Balance data')
              }
      
            const chartData = await response.json()

            const staticdata2 = JSON.stringify(chartData)
            const staticdata3 = JSON.parse(staticdata2)
            //const staticdata4 = await staticdata3[0].mavdata
            //const staticdata5 = await staticdata4
            

            return staticdata3

            

          
};

export async function getUTxOAllocationData() {

  const response = await fetch('https://api.balanceanalytics.io/rpc/utxo_allocation', {
              method: 'get',
              
              headers: {
                
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BALANCE_API_TOKEN}`
              }
              
            });

            if (!response.ok) {
              throw new Error('💩 Could not fetch Balance data')
              }
      
            const chartData = await response.json()

            const staticdata2 = JSON.stringify(chartData)
            const staticdata3 = JSON.parse(staticdata2)
            const staticdata4 = await staticdata3[0].chartdata
            const staticdata5 = await staticdata4
            

            return staticdata5

            

};

export async function getUTxOAllocationDeltaData() {

  const response = await fetch('https://api.balanceanalytics.io/rpc/utxo_delta_allocation', {
              method: 'get',
              
              headers: {
                
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BALANCE_API_TOKEN}`
              }
              
            });

            if (!response.ok) {
              throw new Error('💩 Could not fetch Balance data')
              }
      
            const chartData = await response.json()

            const staticdata2 = JSON.stringify(chartData)
            const staticdata3 = JSON.parse(staticdata2)
            const staticdata4 = await staticdata3[0].chartdata
            const staticdata5 = await staticdata4
            

            return staticdata5

            

};

export async function getUTxOAllocationTotalData() {

  const response = await fetch('https://api.balanceanalytics.io/rpc/utxo_total_allocation', {
              method: 'get',
              
              headers: {
                
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BALANCE_API_TOKEN}`
              }
              
            });

            if (!response.ok) {
              throw new Error('💩 Could not fetch Balance data')
              }
      
            const chartData = await response.json()

            const staticdata2 = JSON.stringify(chartData)
            const staticdata3 = JSON.parse(staticdata2)
            const staticdata4 = await staticdata3[0].chartdata
            const staticdata5 = await staticdata4
            

            return staticdata5

            

};

export async function getUTxORPDelegatedData() {

  const response = await fetch('https://api.balanceanalytics.io/rpc/utxo_rp_delegated', {
              method: 'get',
              
              headers: {
                
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BALANCE_API_TOKEN}`
              }
              
            });

            if (!response.ok) {
              throw new Error('💩 Could not fetch Balance data')
              }
      
            const chartData = await response.json()

            const staticdata2 = JSON.stringify(chartData)
            const staticdata3 = JSON.parse(staticdata2)
            const staticdata4 = await staticdata3[0].chartdata
            const staticdata5 = await staticdata4
            

            return staticdata5

            

};

export async function getEpochData() {

  const response = await fetch('https://api.balanceanalytics.io/rpc/epoch_list', {
              method: 'get',
              
              headers: {
                
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BALANCE_API_TOKEN}`
              }
              
            });

            if (!response.ok) {
              throw new Error('💩 Could not fetch Balance data')
              }
      
            const epochData = await response.json()

            const staticdata2 = JSON.stringify(epochData)
            const staticdata3 = JSON.parse(staticdata2)
            //const staticdata4 = await staticdata3[0].mavdata
            //const staticdata5 = await staticdata4
            

            return staticdata3

            

};


export async function getKeffData() {

  const response = await fetch('https://api.balanceanalytics.io/rpc/pool_keff_sk', {
              method: 'get',
              
              headers: {
                
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BALANCE_API_TOKEN}`
              }
              
            });

            if (!response.ok) {
              throw new Error('💩 Could not fetch Balance data')
              }
      
            const epochData = await response.json()

            const staticdata2 = JSON.stringify(epochData)
            const staticdata3 = JSON.parse(staticdata2)
            //const staticdata4 = await staticdata3[0].mavdata
            //const staticdata5 = await staticdata4
            

            return staticdata3

            

};

export async function getGroupListData() {

  const response = await fetch('https://api.balanceanalytics.io/rpc/pool_group_list', {
              method: 'get',
              
              headers: {
                
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BALANCE_API_TOKEN}`
              }
              
            });

            if (!response.ok) {
              throw new Error('💩 Could not fetch Balance data')
              }
      
            const epochData = await response.json()

            const staticdata2 = JSON.stringify(epochData)
            const staticdata3 = JSON.parse(staticdata2)
            const staticdata4 = await staticdata3[0]
            const staticdata5 = staticdata4.poolgroup
            

            return staticdata5

            

};