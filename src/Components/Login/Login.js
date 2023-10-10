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

	const navigate = useNavigate();

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (u) => {
			if (u) {
				console.log("user online");
				navigate("/");
			}
		});
	}, []);

	const handleLogin = (event) => {
		event.preventDefault();
		setStatus("");

		const auth = getAuth();

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				navigate("/");
			})
			.catch((error) => {
				setStatus("Invalid credentials");
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
					<button>Login</button>
				</form>
				<Link to="/signup">Signup</Link>
			</div>
		</div>
	);
}

export default Login;
