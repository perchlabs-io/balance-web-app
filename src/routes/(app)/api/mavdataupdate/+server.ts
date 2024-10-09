import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { BALANCE_API_TOKEN } from '$env/static/private';
import { supabase } from '$lib/database'


export const GET: RequestHandler = async () => {

    const response = await fetch('https://api.balanceanalytics.io/rpc/network_mav_poolgroup_list', {
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
            const staticdata4 = await staticdata3[0].mavdata
            const api_data_json = await staticdata4

            //console.log(mav_data_json)
            

    const api_id = 'cardano_mav'

    const api = await supabase
		.from('api')
		.select('api_data')
		.match({ api_id })
		.single()

    if (!api.data) {
        const { error } = await supabase.from('api').insert({
            api_id,
            api_data: api_data_json,
        })
    
        if (error) {
            return json({ error: error.message })
        }
    }
    
    if (api.data) {
		const { error } = await supabase
			.from('api')
			.update({
				api_data: api_data_json,
			})
			.match({ api_id })

		if (error) {
			return json({ error: error.message })
		}
	}

  // return json(mav_data_json, {
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// })

  return new Response(undefined, { status: 303, headers: { location: '/' } })
}


