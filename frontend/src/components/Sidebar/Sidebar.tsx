import { NavLink } from "react-router-dom";
import TeamIcon from "../../icons/TeamIcon";
import classNames from "classnames";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.scss";

const Sidebar = ({ allUsers }) => {
	const { user } = useAuth();

	// Only render sidebar if logged in and users exist
	if (!user || allUsers.length === 0) return null;

	return (
		// TODO: aside tag is for sidebars
		<aside className="sidebar">
			<div className="container-title">
				<TeamIcon size={20} />
				<h2>Tým</h2>
			</div>
			<div className="sidebar-container">
				{allUsers.map((user) => {
					return (
						<NavLink
							className={({ isActive }) =>
								classNames("sidebar__link", {
									"sidebar__link--active": isActive,
								})
							}
							key={user._id}
							to={`/users/${user._id}`}
						>
							<span className="avatar">
								{user.name.split(" ")[0][0] + user.name.split(" ")[1][0]}
							</span>
							<span>{user.name}</span>
						</NavLink>
					);
				})}
			</div>
		</aside>
	);
};

export default Sidebar;
