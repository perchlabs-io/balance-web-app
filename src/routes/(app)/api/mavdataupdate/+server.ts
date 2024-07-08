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
            const mav_data_json = await staticdata4

            console.log(mav_data_json)
            

    const mav_id = 'cardano'

    const mav = await supabase
		.from('mav')
		.select('mav_data')
		.match({ mav_id })
		.single()

    if (!mav.data) {
        const { error } = await supabase.from('mav').insert({
            mav_id,
            mav_data: mav_data_json,
        })
    
        if (error) {
            return json({ error: error.message })
        }
    }
    
    if (mav.data) {
		const { error } = await supabase
			.from('mav')
			.update({
				mav_data: mav_data_json,
			})
			.match({ mav_id })

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


