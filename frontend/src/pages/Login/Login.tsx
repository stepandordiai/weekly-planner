import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./Login.scss";

type User = {
	id: string;
	username: string;
};

type Props = {
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const Login = ({ setUser }: Props) => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const handleChange = (e) => {
		// TODO:
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				"https://weekly-planner-backend.onrender.com/api/users/login",
				formData
			);
			localStorage.setItem("token", res.data.token);
			setUser(res.data);
			navigate("/");
		} catch (error) {
			setError(error);
		}
	};
	return (
		<main className="login">
			<div>
				<h1 style={{ fontSize: "2rem", marginBottom: 20 }}>Log in</h1>
				{error && <p>{error}</p>}
				{/* TODO: */}
				<form action="" onSubmit={handleSubmit}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							marginBottom: 10,
						}}
					>
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
					<div style={{ display: "flex", flexDirection: "column" }}>
						<label htmlFor="password">Password</label>
						<input
							id="password"
							className="input"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Enter your password"
							required
						/>
					</div>
					<button type="submit" className="login-btn">
						Login
					</button>
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
					<p style={{ marginBottom: 10 }}>Don't have an account?</p>
					<NavLink className="login__link" to="/register">
						Create an account
					</NavLink>
				</div>
			</div>
		</main>
	);
};

export default Login;
