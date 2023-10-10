import React, { useContext, useState } from "react";
import "./Header.css";
import OlxLogo from "../../assets/OlxLogo";
import Search from "../../assets/Search";
import Arrow from "../../assets/Arrow";
import SellButton from "../../assets/SellButton";
import SellButtonPlus from "../../assets/SellButtonPlus";
import { AuthContext } from "../../stores/AppContexts";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";

function Header() {
	const { user, setUser } = useContext(AuthContext);
	const [searchTerm, setSearchTerm] = useState("");

	const handleClick = () => {
		console.log(searchTerm);
	};

	const handleLogout = () => {
		const auth = getAuth();

		signOut(auth)
			.then(() => {
				setUser(null);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className="headerParentDiv">
			<div className="headerChildDiv">
				<div className="brandName">
					<Link to="/">
						<OlxLogo />
					</Link>
				</div>
				<div className="placeSearch">
					<Search />
					<input type="text" />
					<Arrow />
				</div>
				<div className="productSearch">
					<div className="input">
						<input
							type="text"
							placeholder="Find car,mobile phone and more..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div onClick={handleClick} className="searchAction">
						<Search color="#ffffff" />
					</div>
				</div>
				<div className="language">
					<span> ENGLISH </span>
					<Arrow />
				</div>
				<div className="loginPage">
					{user ? (
						`Welcome ${user.displayName}`
					) : (
						<span>
							<Link to="/login">Login</Link>
						</span>
					)}
					<hr />
				</div>
				{user && (
					<span style={{ cursor: "pointer" }} onClick={handleLogout}>
						Logout
					</span>
				)}
				<div className="sellMenu">
					<SellButton />
					<div className="sellMenuContent">
						<SellButtonPlus />
						<span>
							<Link to="/sell">Sell</Link>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Header;
