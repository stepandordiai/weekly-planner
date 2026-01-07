import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./Login.scss";

type User = {
	id: string;
	username: string;
};

type Loginrops = {
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const Login = ({ setUser }: Loginrops) => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				"https://weekly-planner-backend.onrender.com/api/users/login",
				formData
			);
			localStorage.setItem("token", res.data.token);
			setUser(res.data);

			setTimeout(() => {
				navigate(`/users/${res.data.id}`);
			}, 100);
			// FIXME:
		} catch (err) {
			setError(err.response?.data.message);
			console.error("Full Error Object:", err.response?.data.message);
		}
	};

	return (
		<main className="login">
			<div className="login-container">
				<h1 style={{ fontSize: "2rem", marginBottom: 25 }}>Prihlasit se</h1>
				{error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}
				{/* TODO: */}
				<form className="login-form" action="" onSubmit={handleSubmit}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<label htmlFor="username">Uživatelské jméno</label>
						<input
							id="username"
							className="login__input"
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							placeholder="Zadejte své uživatelské jméno"
							required
							autoComplete="off"
						/>
					</div>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<label htmlFor="password">Heslo</label>
						<input
							id="password"
							className="login__input"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Zadejte své heslo"
							required
						/>
					</div>
					<button type="submit" className="login__btn">
						Přihlásit se
					</button>
				</form>
				<div style={{ marginTop: 25 }}>
					<span>Don't have an account?</span>{" "}
					<NavLink style={{ textDecoration: "underline" }} to="/register">
						Create an account
					</NavLink>
				</div>
			</div>
		</main>
	);
};

export default Login;
