import {useOutletContext} from "@remix-run/react";
import {SupabaseClient} from '@supabase/supabase-js';

import type {Database} from "~/types/database";
type TypeSupabaseClient = SupabaseClient<Database>;
export type SupabaseOutletContext = {
	supabase: TypeSupabaseClient
}

export const useSuperbase = () => {
	const {supabase} = useOutletContext<SupabaseOutletContext>();
	return supabase;
}
