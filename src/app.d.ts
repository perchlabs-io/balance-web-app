import type {SvelteComponentType} from 'svelte'
import type {Theme} from './types'
import { Subscriber, Unsubscriber } from 'svelte/store';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'



declare global {
	namespace App {
		
		interface Locals {
			supabase: SupabaseClient
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
			session: Session | null
			user: User | null
		}
	   
	}
}

export {};
