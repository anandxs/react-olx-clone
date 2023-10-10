import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Create from "./Pages/Create";
import View from "./Pages/ViewPost";
import { AuthContext } from "./stores/AppContexts";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
	const { setUser } = useContext(AuthContext);

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (u) => {
			if (u) setUser(u);
		});
	}, []);

	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/login" element={<Login />} />
			<Route path="/sell" element={<Create />} />
			<Route path="/view/:productId" element={<View />} />
		</Routes>
	);
}

export default App;
