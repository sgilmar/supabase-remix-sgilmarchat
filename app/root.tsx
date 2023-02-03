import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRevalidator,
} from "@remix-run/react";

import styles from './styles/global.css';
import * as process from "process";
import {useEffect, useState} from "react";
import {Database} from "~/types/database";
import {createBrowserClient} from '@supabase/auth-helpers-remix';
import {createSupabaseServerClient} from "~/utils/supabase.server";

import type {LinksFunction, LoaderArgs, MetaFunction} from "@remix-run/node";
import {json} from "@remix-run/node";

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "sgilmar Chat Real Time",
	viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
	{rel: "stylesheet", href: styles},
];

export const loader = async ({request}: LoaderArgs) => {
	const env = {
		SUPABASE_URL: process.env.SUPABASE_URL!,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
	}
	
	const response = new Response();
	
	const supabase = createSupabaseServerClient({request, response});
	
	const {data: {session}} = await supabase.auth.getSession();
	
	return json({env, session}, {headers: response.headers});
}

export default function App() {
	const {env, session: serverSession} = useLoaderData<typeof loader>();
	const revalidator = useRevalidator();
	
	// console.log('server', {session})
	
	const [supabase] = useState(() => createBrowserClient<Database>(
		env.SUPABASE_URL,
		env.SUPABASE_ANON_KEY,
	));
	
	useEffect(() => {
		const {data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
			if (session?.access_token != serverSession?.access_token) {
				// window.location.reload();
				revalidator.revalidate();
			}
		})
		
		return () => subscription?.unsubscribe();
	}, []);
	
	return (
		<html lang="es">
		<head>
			<Meta/>
			<Links/>
		</head>
		<body>
		<Outlet context={{supabase}}/>
		<ScrollRestoration/>
		<Scripts/>
		<LiveReload/>
		</body>
		</html>
	);
}
