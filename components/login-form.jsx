import { auth } from "../firebase";
import useFirebaseLogin from "../hooks/use-firebase-login";
import Submit from "./submit";
import Error from "./error";
import Input from "./input";

export default function LoginForm(props) {
	const { login, loading, error } = useFirebaseLogin(auth);

	const handleSubmit = (e) => {
		e.preventDefault();
		login(
			e.target.elements.email.value,
			e.target.elements.password.value
		);
	}

	return (
		<form onSubmit={handleSubmit} {...props}>
			<h3>Login</h3>
			<Input type="text" id="email" placeholder="Email"/>
			<Input type="password" id="password" placeholder="Password"/>
			<Submit loading={loading} className="mt-2">Login</Submit>
			{error && <Error>Error logging in</Error>}
		</form>
	)
}