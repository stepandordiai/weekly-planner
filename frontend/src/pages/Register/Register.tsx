import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./Register.scss";

type User = {
	id: string;
	name: string;
	username: string;
};

type Props = {
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const Register = ({ setUser }: Props) => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "",
		username: "",
		password: "",
	});

	const [error, setError] = useState("");

	const handleChange = (e) => {
		// TODO:
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				"https://weekly-planner-backend.onrender.com/api/users/register",
				formData
			);
			localStorage.setItem("token", res.data.token);
			setUser(res.data);
			console.log(res.data);
			navigate("/");
		} catch (err) {
			// This line is the key to seeing the REAL error from your Express server
			const message = "Registration failed";
			setError(message);
			console.error("Full Error Object:", err.response?.data);
		}
	};
	return (
		<div className="register">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
				<h1 style={{ fontSize: "2rem", marginBottom: 20 }}>
					Create an account
				</h1>
				{error && <p>{error}</p>}
				{/* TODO: */}
				<form action="" onSubmit={handleSubmit}>
					<div className="input-container">
						<label htmlFor="name">Name</label>
						<input
							id="name"
							className="input"
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Enter your name"
							required
							// TODO:
							autoComplete="off"
						/>
					</div>
					<div className="input-container">
						<label htmlFor="username">Username</label>
						<input
							id="username"
							className="input"
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							placeholder="Enter your username"
							required
							// TODO:
							autoComplete="off"
						/>
					</div>
					<div className="input-container">
						<label htmlFor="password">Password</label>
						<input
							className="input"
							id="password"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Enter your password"
							required
						/>
					</div>
					<button className="register__btn">Register</button>
				</form>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<span className="login-line"></span>
					<span style={{ marginBottom: 10 }}>Already have an account?</span>
					<NavLink style={{ textDecoration: "underline" }} to="/login">
						Log in
					</NavLink>
				</div>
			</div>
		</div>
	);
};

export default Register;
