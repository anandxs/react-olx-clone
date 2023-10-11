import { useContext, useEffect, useId, useState } from "react";
import "./View.css";
import {
	doc,
	getDoc,
	query,
	collection,
	where,
	getDocs,
} from "firebase/firestore";
import { FirebaseContext } from "../../stores/AppContexts";
import { useParams } from "react-router-dom";

function View() {
	const { productId } = useParams();

	const { db } = useContext(FirebaseContext);

	const [product, setProduct] = useState();
	const [seller, setSeller] = useState();
	const [error, setError] = useState();

	const getProduct = async () => {
		const docSnap = await getDoc(doc(db, "products", productId));

		const data = { ...docSnap.data() };
		if (docSnap.exists()) {
			setProduct(data);
			return data.userId;
		} else {
			setError("Could not find product");
		}
	};

	const getSeller = async (userId) => {
		const q = query(collection(db, "users"), where("id", "==", userId));

		const querySnapshot = await getDocs(q);
		const x = querySnapshot.docs.map((doc) => {
			return { ...doc.data() };
		});

		return x[0];
	};

	useEffect(() => {
		getProduct()
			.then((userId) => {
				getSeller(userId)
					.then((user) => {
						setSeller(user);
					})
					.catch((err) => {
						console.log("could not find seller");
					});
			})
			.catch((error) => {
				console.log(error.message);
			});
	}, []);

	return (
		<>
			{error !== "" && (
				<div className="viewParentDiv">
					<h1>{error}</h1>
				</div>
			)}
			{product && (
				<div className="viewParentDiv">
					<div className="imageShowDiv">
						<img src={product?.url} alt="" />
					</div>
					<div className="rightSection">
						<div className="productDetails">
							<p>&#x20B9; {product?.price}</p>
							<span>{product?.itemName}</span>
							<p>{product?.category}</p>
							<span>{product?.createdAt}</span>
						</div>
						{seller && (
							<div className="contactDetails">
								<h3>Seller Details</h3>
								<p>Username: {seller.username}</p>
								<p>Phone: {seller.phoneNumber}</p>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
export default View;
