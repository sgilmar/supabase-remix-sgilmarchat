import {Form, useLoaderData, useRouteLoaderData} from "@remix-run/react";
import {json} from "@remix-run/node";
import {createSupabaseServerClient} from "~/utils/supabase.server";
import {Login} from "~/components/Login";
import {RealTimeMessages} from "~/components/RealTimeMessages";

import type {ActionArgs, LoaderArgs} from "@remix-run/node";

// loader de datos en el server
export const loader = async ({request}: LoaderArgs) => {
	const response = new Response();
	const supabase = createSupabaseServerClient({request, response});
	const {data} = await supabase.from("messages").select();
	
	return json({messages: data ?? []}, {headers: response.headers});
};

// action > función que se ejecuta cuando se hace submit en el form del componente
export const action = async ({request}: ActionArgs) => {
	const response = new Response();
	const supabase = createSupabaseServerClient({request, response});
	
	// formData de la request
	const formData = await request.formData();
	// Recuperar todos los inputs
	const {message} = Object.fromEntries(formData);
	// Guardar en supabase
	await supabase.from('messages').insert({content: String(message)})
	
	return json({message: 'ok'}, {headers: response.headers})
}

export default function Index() {
	const {messages} = useLoaderData<typeof loader>();
	
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
			<h1>sgilmar Chat Real Time</h1>
			<Login/>
			
			<Form method="post">
				<input type="text" name="message"/>
				<button type="submit">Enviar mensaje</button>
			</Form>
			
			<RealTimeMessages serverMessages={messages}/>
		</div>
	);
}
