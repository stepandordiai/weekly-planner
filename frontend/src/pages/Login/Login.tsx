import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./Login.scss";

const Login = () => {
	const { setUser } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(null);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [loggedInUser, setLoggedInUser] = useState(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/login`,
				formData,
			);
			localStorage.setItem("token", res.data.token);

			setLoggedInUser(res.data);
		} catch (err) {
			// TODO: learn this
			setError(err.response?.data.message);
			console.error("Full Error Object:", err.response?.data.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (loggedInUser) {
			setUser(loggedInUser);

			// Save user object
			localStorage.setItem("user", JSON.stringify(loggedInUser));

			navigate(`/users/${loggedInUser._id}`);
		}
	}, [loggedInUser, navigate, setUser]);

	return (
		<main className="login">
			<div className="login-container">
				<h1 style={{ fontSize: "2rem", marginBottom: 25 }}>Přihlasit se</h1>
				{error && <p style={{ color: "#f00", marginBottom: 10 }}>{error}</p>}
				<form className="login-form" onSubmit={handleSubmit}>
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
					<button type="submit" className="login__btn" disabled={loading}>
						{loading ? <LoadingSpinner /> : "Přihlásit se"}
					</button>
				</form>
				<div style={{ marginTop: 25 }}>
					<span>Nemáte účet?</span>{" "}
					<NavLink style={{ textDecoration: "underline" }} to="/register">
						Vytvořte si účet
					</NavLink>
				</div>
			</div>
		</main>
	);
};

export default Login;
