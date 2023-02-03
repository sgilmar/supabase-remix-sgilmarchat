import {useSuperbase} from "~/hooks/useSuperbase";

export function Login() {
	const supabase = useSuperbase();
	
	const handleLogout = async () => {
		const {error} = await supabase.auth.signOut();
		if (error) console.log('Error al cerrar sesión');
	}
	
	const handleLogin = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'github'
		})
	}
	
	return (
		<>
			<button onClick={handleLogout}>Cerrar sesión</button>
			<button onClick={handleLogin}>Iniciar sesión</button>
		</>
	);
}

