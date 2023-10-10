import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../olx-logo.png";
import "./Signup.css";
import { AuthContext, FirebaseContext } from "../../stores/AppContexts";
import { useNavigate } from "react-router-dom";
import { collection, where, query, getDocs, addDoc } from "firebase/firestore";
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
	onAuthStateChanged,
} from "firebase/auth";

function Signup() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const { db } = useContext(FirebaseContext);
	const { user } = useContext(AuthContext);

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

	const checkUsername = async () => {
		const q = query(collection(db, "users"), where("username", "==", username));

		const querySnapshot = await getDocs(q);
		const users = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
		if (users.length !== 0) return true;

		return false;
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setError("");

		checkUsername()
			.then((x) => {
				if (x) {
					setError("Username is already taken");
					return;
				}
			})
			.catch((err) => console.log(err.message));

		let exit = false;

		if (username == "") {
			setError("Username is required");
			exit = true;
		}

		if (phone == "") {
			setError((currentError) => `${currentError} Phone number is required`);
			exit = true;
		}

		if (exit) return;

		const auth = getAuth();

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;

				updateProfile(auth.currentUser, { displayName: username })
					.then(async () => {
						await addDoc(collection(db, "users"), {
							id: user.uid,
							username: username,
							phoneNumber: phone,
						});
						navigate("/login");
					})
					.catch((err) => {
						console.log(err.message);
					});
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	return (
		<div>
			<div className="signupParentDiv">
				<img width="200px" height="200px" src={Logo} />
				{error !== "" && <p className="error-msg">{error}</p>}
				<form onSubmit={handleSubmit}>
					<label htmlFor="username">Username</label>
					<br />
					<input
						className="input"
						type="text"
						id="username"
						name="name"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<br />
					<label htmlFor="email">Email</label>
					<br />
					<input
						className="input"
						type="email"
						id="email"
						name="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<br />
					<label htmlFor="phone">Phone</label>
					<br />
					<input
						className="input"
						type="number"
						id="phone"
						name="phone"
						placeholder="Phone Number"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
					<br />
					<label htmlFor="password">Password</label>
					<br />
					<input
						className="input"
						type="password"
						id="password"
						name="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<br />
					<br />
					<button>Signup</button>
				</form>
				<Link to="/login">Login</Link>
			</div>
		</div>
	);
}

export default Signup;
