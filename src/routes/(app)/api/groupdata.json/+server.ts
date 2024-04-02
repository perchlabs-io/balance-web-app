import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'

import { supabase } from '$lib/database'

export const GET: RequestHandler = async () => {
	const { data: pool_groups, error } = await supabase
		.from('pool_groups')
		.select('pool_group_json')

	if (error) {
		return json({ error: error.message })
	}

	return json(pool_groups, {
		headers: {
			'Content-Type': 'application/json'
		},
	})
}