import { useParams } from "react-router-dom";
import usersData from "../../assets/data/users-data.json";
import Weekbar from "../../components/Weekbar/Weekbar";
import "./UserPage.scss";
import Visit from "../../components/Visit/Visit";

const UserPage = () => {
	const { id } = useParams();

	const user = usersData.find((user) => String(user.id) === id);

	return (
		<main className="user-page">
			<Weekbar />
			<Visit />
			<p style={{ color: "#000" }}>{user?.name}</p>

			{/* <div className="user-page">
				{weekData.map((week) => {
					return (
						<div className="user-page-input-container" key={week.id}>
							<p>{week.day}</p>
							<input type="text" placeholder="Enter text" />
							<input type="reset" />
						</div>
					);
				})}
			</div> */}
		</main>
	);
};

export default UserPage;
