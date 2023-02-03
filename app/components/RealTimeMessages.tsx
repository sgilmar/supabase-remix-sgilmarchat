import {useSuperbase} from '~/hooks/useSuperbase';
import {useEffect, useState} from "react";

import type {Database} from '~/types/database';

type Message = Database['public']['Tables']['messages']['Row']

export function RealTimeMessages({
																	 serverMessages
																 }: {
	serverMessages: Message[]
}) {
	console.log(serverMessages)
	
	const [messages, setMessages] = useState<Message[]>(serverMessages)
	const supabase = useSuperbase()
	
	useEffect(() => {
		const channel = supabase
			.channel('*')
			.on(
				'postgres_changes', // broadcast
				{
					event: 'INSERT',
					schema: 'public',
					table: 'messages'
				},
				(payload) => {
					const newMessage = payload.new as Message
					setMessages((messages) => [...messages, newMessage])
				})
			.subscribe()
		
		return () => {
			supabase.removeChannel(channel)
		}
	}, [supabase])
	
	return (
		<>
			<pre>{JSON.stringify(messages, null, 2)}</pre>
		</>
	)
	
}
