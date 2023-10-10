import { useContext, useEffect, useState } from "react";
import Heart from "../../assets/Heart";
import "./Post.css";
import { getDocs, collection } from "firebase/firestore";
import { FirebaseContext } from "../../stores/AppContexts";
import { useNavigate } from "react-router-dom";

function Posts() {
	const [products, setProducts] = useState([]);

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
										<p className="name">{product.name}</p>
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
					<div className="card">
						<div className="favorite">
							<Heart />
						</div>
						<div className="image">
							<img src="../../../Images/R15V3.jpg" alt="" />
						</div>
						<div className="content">
							<p className="rate">&#x20B9; 250000</p>
							<span className="kilometer">Two Wheeler</span>
							<p className="name"> YAMAHA R15V3</p>
						</div>
						<div className="date">
							<span>10/5/2021</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Posts;
