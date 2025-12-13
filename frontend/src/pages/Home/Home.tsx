import usersData from "./../../assets/data/users-data.json";
import "./Home.scss";

const weekData = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const monthData = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const dateNow = new Date();
const correctDate = dateNow.getDay() === 0 ? 6 : dateNow.getDay() - 1;
const dayNow = weekData[correctDate];
const month = dateNow.getMonth();
const date = dateNow.getDate();
const monthNow = monthData[month];

const Home = () => {
	return (
		<main className="home">
			<p style={{ marginBottom: 50 }}>Home</p>
			<p style={{ fontSize: "2rem" }}>
				{dayNow} {monthNow} {date}
			</p>
			<div className="home-users-container">
				{usersData.map((user) => {
					return (
						<div className="home-user-container" key={user.id}>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<p>{user.name}</p>
								<p>13:47</p>
							</div>
							<form action="">
								{/* <input type="text" placeholder="text" /> */}
								<textarea
									className="textarea"
									name=""
									id=""
									rows={5}
								></textarea>
								<div
									style={{ display: "flex", justifyContent: "space-between" }}
								>
									<input
										style={{
											background: "red",
											color: "white",
											padding: 5,
											borderRadius: 5,
										}}
										type="reset"
										value="Reset"
									/>
									<button
										style={{
											background: "green",
											color: "white",
											padding: 5,
											borderRadius: 5,
										}}
										type="submit"
									>
										Submit
									</button>
								</div>
							</form>
						</div>
					);
				})}
			</div>
		</main>
	);
};

export default Home;
