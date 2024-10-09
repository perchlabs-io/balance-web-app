import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { supabase } from '$lib/database'

export const GET: RequestHandler = async () => {

	const api_id = 'group_leverage'

	const { data: api, error } = await supabase
		.from('api')
		.select('api_data')
		.match({ api_id })
		.single()

	if (error) {
		return json({ error: error.message })
	}

	return json(api, {
		headers: {
			'Content-Type': 'application/json'
		},
	})
}