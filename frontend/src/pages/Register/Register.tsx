import { useNavigate } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./Register.scss";

const Register = () => {
	const { setUser } = useAuth();
	const navigate = useNavigate();

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		username: "",
		password: "",
	});

	// TODO: learn this
	const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	// TODO: learn this
	const handleForm = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!formData.name.trim().includes(" ")) {
			setError("Zadejte své jméno a příjmení (např. Jan Novák)");
			return;
		}

		setError(null);
		setLoading(true);

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/register`,
				formData,
			);

			localStorage.setItem("token", res.data.token);
			// TODO: learn this
			localStorage.setItem("user", JSON.stringify(res.data));

			setUser(res.data);
			navigate("/");
		} catch (err) {
			setError(err.response?.data.message);
			console.error("Full Error Object:", err.response?.data.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="register">
			<div className="register-container">
				<h1 style={{ fontSize: "2rem", marginBottom: 25 }}>Registrace</h1>
				{error && <p style={{ color: "#f00", marginBottom: 10 }}>{error}</p>}
				{/* TODO: */}
				<form className="register-form" action="" onSubmit={handleForm}>
					<div className="register-input-container">
						<label htmlFor="name">Jméno a příjmení</label>
						<input
							style={
								!formData.name.trim().includes(" ") && formData.name
									? { border: "1px solid #f00" }
									: { border: "var(--secondary-border)" }
							}
							id="name"
							className="register__input"
							type="text"
							name="name"
							value={formData.name}
							onChange={handleFormData}
							placeholder="Zadejte své jméno a příjmení"
							required
							// TODO: learn this
							// FIXME:
							autoComplete="off"
						/>
					</div>
					<div className="register-input-container">
						<label htmlFor="username">Uživatelské jméno</label>
						<input
							id="username"
							className="register__input"
							type="text"
							name="username"
							value={formData.username}
							onChange={handleFormData}
							placeholder="Zadejte své uživatelské jméno"
							required
							// FIXME:
							autoComplete="off"
						/>
					</div>
					<div className="register-input-container">
						<label htmlFor="password">Heslo</label>
						<input
							className="register__input"
							id="password"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleFormData}
							placeholder="Zadejte své heslo"
							required
						/>
					</div>
					<button type="submit" className="register__btn">
						{loading ? <LoadingSpinner /> : "Vytvořit účet"}
					</button>
				</form>
				<div style={{ marginTop: 25 }}>
					<span>Už máte účet?</span>{" "}
					<NavLink style={{ textDecoration: "underline" }} to="/login">
						Přihlaste se
					</NavLink>
				</div>
			</div>
		</main>
	);
};

export default Register;
