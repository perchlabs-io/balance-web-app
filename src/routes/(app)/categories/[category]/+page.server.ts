import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

import { getPostsByCategory } from '$lib/api/posts'

import { categories } from '$lib/api/config'

export const load: PageServerLoad = async ({ params, setHeaders }) => {

	

	if (!categories[params.category]) {
		error(404);
	}

	const posts = await getPostsByCategory(params.category)

	setHeaders({
		'Cache-Control': `max-age=0, s-maxage=${60 * 60}`,
	})

	return { posts }
}