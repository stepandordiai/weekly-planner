import { useParams } from "react-router-dom";
import usersData from "../../assets/data/users-data.json";
import "./UserPage.scss";

const weekData = [
	{ id: 1, day: "Monday" },
	{ id: 2, day: "Tuesday" },
	{ id: 3, day: "Wednesday" },
	{ id: 4, day: "Thursday" },
	{ id: 5, day: "Friday" },
	{ id: 6, day: "Saturday" },
	{ id: 7, day: "Sunday" },
];

const UserPage = () => {
	const { id } = useParams();

	const user = usersData.find((user) => String(user.id) === id);

	return (
		<div>
			<p>{user?.name}</p>

			<div className="user-page">
				{weekData.map((week) => {
					return (
						<div className="user-page-input-container" key={week.id}>
							<p>{week.day}</p>
							<input type="text" placeholder="Enter text" />
							<input type="reset" />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default UserPage;
