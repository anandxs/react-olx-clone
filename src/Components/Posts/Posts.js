import { useContext, useEffect, useState } from "react";
import Heart from "../../assets/Heart";
import "./Post.css";
import { getDocs, collection } from "firebase/firestore";
import { FirebaseContext } from "../../stores/AppContexts";
import { useNavigate } from "react-router-dom";

function Posts() {
	const [products, setProducts] = useState([]);
	const [latestthree, setLatestThree] = useState([]);

	const { db } = useContext(FirebaseContext);

	const navigate = useNavigate();

	useEffect(() => {
		const getData = async () => {
			const querySnapshot = await getDocs(collection(db, "products"));
			return querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
		};

		getData()
			.then((x) => {
				setProducts(x);
			})
			.catch((error) => {
				console.log(error);
			});

		const getLatestThree = async () => {
			const querySnapshot = await getDocs(collection(db, "products"));
			const prods = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			prods.sort((a, b) => {
				const d1 = new Date(a.createdAt);
				const d2 = new Date(b.createdAt);
				if (d1 > d2) return -1;
				else if (d1 == d2) return 0;
				return 1;
			});

			if (prods.length < 4) return prods;

			return prods.slice(0, 4);
		};

		getLatestThree()
			.then((x) => setLatestThree(x))
			.catch((err) => console.log(err.message));
	}, []);

	const handleClick = (product) => {
		navigate(`/view/${product.id}`);
	};

	return (
		<div className="postParentDiv">
			<div className="moreView">
				<div className="heading">
					<span>Quick Menu</span>
					<span>View more</span>
				</div>
				<div className="cards">
					{products.length !== 0 ? (
						products.map((product) => {
							return (
								<div
									onClick={() => handleClick(product)}
									key={product.id}
									className="card"
								>
									<div className="favorite">
										<Heart />
									</div>
									<div className="image">
										<img src={product.url} alt="product image" />
									</div>
									<div className="content">
										<p className="rate">&#x20B9; {product.price}</p>
										<span className="kilometer">{product.category}</span>
										<p className="name">{product.itemName}</p>
									</div>
									<div className="date">
										<span>{product.createdAt}</span>
									</div>
								</div>
							);
						})
					) : (
						<p>No products listed</p>
					)}
				</div>
			</div>
			<div className="recommendations">
				<div className="heading">
					<span>Fresh recommendations</span>
				</div>
				<div className="cards">
					{latestthree?.length !== 0 ? (
						latestthree.map((product) => {
							return (
								<div key={product.id} className="card">
									<div className="favorite">
										<Heart />
									</div>
									<div className="image">
										<img src={product.url} alt="" />
									</div>
									<div className="content">
										<p className="rate">&#x20B9; {product.price}</p>
										<span className="kilometer">{product.category}</span>
										<p className="name">{product.itemName}</p>
									</div>
									<div className="date">
										<span>{product.createdAt}</span>
									</div>
								</div>
							);
						})
					) : (
						<p>No products to list</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default Posts;
