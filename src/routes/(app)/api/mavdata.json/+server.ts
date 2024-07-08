import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { supabase } from '$lib/database'

export const GET: RequestHandler = async () => {
	const { data: mav, error } = await supabase
		.from('mav')
		.select('mav_data')

	if (error) {
		return json({ error: error.message })
	}

	return json(mav, {
		headers: {
			'Content-Type': 'application/json'
		},
	})
}