import { useState, useContext, useEffect } from "react";
import Logo from "../../olx-logo.png";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import {
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { AuthContext } from "../../stores/AppContexts";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("");
	const [disableButton, setDisableButton] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (u) => {
			if (u) {
				navigate("/");
			}
		});
	}, []);

	const handleLogin = (event) => {
		event.preventDefault();
		setStatus("");

		console.log("clicked");

		setDisableButton(true);

		const auth = getAuth();

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				setDisableButton(true);
				navigate("/");
			})
			.catch((error) => {
				setStatus("Invalid credentials");
				setDisableButton(false);
			});
	};

	return (
		<div>
			<div className="loginParentDiv">
				<img width="200px" height="200px" src={Logo} />
				<form onSubmit={handleLogin}>
					{status !== "" && <p>{status}</p>}
					<label htmlFor="email">Email</label>
					<br />
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="input"
						type="email"
						id="email"
						name="email"
						placeholder="Email"
					/>
					<br />
					<label htmlFor="password">Password</label>
					<br />
					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="input"
						type="password"
						id="password"
						name="password"
						placeholder="Password"
					/>
					<br />
					<br />
					<button type="submit" disabled={disableButton}>
						{disableButton ? "Loading..." : "Login"}
					</button>
				</form>
				<Link to="/signup">Signup</Link>
			</div>
		</div>
	);
}

export default Login;
