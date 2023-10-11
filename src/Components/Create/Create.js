import "./Create.css";
import Header from "../Header/Header";
import { useContext, useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { AuthContext, FirebaseContext } from "../../stores/AppContexts";
import { useNavigate } from "react-router-dom";

const Create = () => {
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState("");
	const [image, setImage] = useState("");
	const [error, setError] = useState("");
	const [disableButton, setDisableButton] = useState(false);

	const { user } = useContext(AuthContext);
	const { db } = useContext(FirebaseContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) navigate("/login");
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		setError("");
		setDisableButton(true);

		let exit = false;

		if (!user) {
			setError("Login to list product");
			exit = true;
		}

		if (name.trim() == "") {
			setError((currentError) => `${currentError} Name is required`);
			exit = true;
		}

		if (category.trim() == "") {
			setError((currentError) => `${currentError} Category is required`);
			exit = true;
		}

		if (price < 0) {
			setError(
				(currentError) => `${currentError} Price should be a positive number`
			);
			exit = true;
		}

		if (!price) {
			setError((currentError) => `${currentError} Price is required`);
			exit = true;
		}

		if (!image) {
			setError((currentError) => `${currentError} Image is required`);
			exit = true;
		}

		if (exit) {
			setDisableButton(false);
			return;
		}

		const newId = crypto.randomUUID();

		const storage = getStorage();
		const storageRef = ref(storage, `images/${newId}`);

		const date = new Date();

		uploadBytes(storageRef, image)
			.then((snapshot) => {
				console.log("uploaded image");

				getDownloadURL(storageRef)
					.then(async (url) => {
						console.log(url);

						try {
							await addDoc(collection(db, "products"), {
								itemName: name,
								category: category,
								price: price,
								url: url,
								userId: user.uid,
								createdAt: date.toDateString(),
							});
							console.log("added to firestore");
							navigate("/");
							setDisableButton(false);
						} catch (error) {
							console.log("could not add to firestore");
							setDisableButton(false);
						}
					})
					.catch((err) => {
						console.log("could not get url");
						setDisableButton(false);
					});
			})
			.catch((err) => {
				setDisableButton(false);
			});
	};

	return (
		<>
			<Header />
			<div className="centerDiv">
				<form onSubmit={handleSubmit}>
					{error !== "" && <p className="error-msg">{error}</p>}
					<label htmlFor="item-name">Name</label>
					<br />
					<input
						className="input"
						type="text"
						id="item-name"
						name="Name"
						placeholder="Item name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<br />
					<label htmlFor="category">Category</label>
					<br />
					<input
						className="input"
						type="text"
						id="category"
						name="category"
						placeholder="Category"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					/>
					<br />
					<label htmlFor="price">Price</label>
					<br />
					<input
						className="input"
						type="number"
						id="price"
						name="Price"
						placeholder="Enter price"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
					<br />
					<br />
					{image !== "" && (
						<img
							alt="Posts"
							width="200px"
							height="200px"
							src={image !== "" ? URL.createObjectURL(image) : ""}
						></img>
					)}
					<br />
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setImage(e.target.files[0])}
					/>
					<br />
					{!disableButton ? (
						<button className="uploadBtn">Upload and Create</button>
					) : (
						<button className="uploadBtn" disabled>
							Loading...
						</button>
					)}
				</form>
			</div>
		</>
	);
};

export default Create;
