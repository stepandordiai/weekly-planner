import "./Home.scss";
import { NavLink } from "react-router-dom";

const Home = ({ user, error }) => {
	return (
		<>
			<main className="home">
				<div>{error && <p>{error}</p>}</div>
				{user ? (
					<div>
						<p>Welcome {user.username}!</p>
						<p>Email: {user.email}</p>
					</div>
				) : (
					<div>
						<p>Hello Traveller...</p>
						<p>Please login or register!</p>
						<NavLink to="/login">Login</NavLink>
						<NavLink to="/register">Register</NavLink>
					</div>
				)}
			</main>
		</>
	);
};

export default Home;
