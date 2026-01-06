import logo from "/logo/logo-black.png";
import { NavLink } from "react-router-dom";
import "./Header.scss";
import { useNavigate } from "react-router-dom";

const Header = ({ setUser }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		setUser(null);
		navigate("/");
	};
	return (
		<header className="header">
			<NavLink className="header__logo" to="/">
				<img src={logo} alt="" />
				<span style={{ display: "flex", flexDirection: "column" }}>
					<span>NERESEN a.s.</span>
					<span>Říyení práce a plánovač úkolů</span>
				</span>
			</NavLink>
			<button onClick={handleLogout} style={{ color: "#000" }}>
				Prihlasit se
			</button>
		</header>
	);
};

export default Header;
