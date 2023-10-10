import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Context, FirebaseContext } from "./stores/AppContexts";
import firebase from "./firebase/config";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Context>
			<FirebaseContext.Provider value={firebase}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</FirebaseContext.Provider>
		</Context>
	</React.StrictMode>
);
