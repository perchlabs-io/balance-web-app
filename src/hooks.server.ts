import type {Cookies, Handle} from '@sveltejs/kit'
import '$lib/supabase'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'




const getSfxOnFromCookie = (cookies: Cookies): boolean => {
	const sfxOn = cookies.get('sfxOn')

	return sfxOn === 'false' ? false : true
}

export const handle: Handle = async ({event, resolve}) => {
	
	event.locals.sfxOn = getSfxOnFromCookie(event.cookies)

	const { session, supabaseClient } = await getSupabase(event)
	
	
	event.locals.sb = supabaseClient
	event.locals.session = session

	

	const response = await resolve(event)

	return response
}
