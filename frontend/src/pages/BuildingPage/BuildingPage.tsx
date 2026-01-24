import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import classNames from "classnames";
import WorkSchedule from "../../components/WorkSchedule/WorkSchedule";
import OrderedAndPurchasedItems from "../../components/PurchasedItems/OrderedAndPurchasedItems";
import { useAuth } from "../../context/AuthContext";
import StatusIndicator from "../../components/StatusIndicator/StatusIndicator";
import "./BuildingPage.scss";
import api from "../../axios";

const BuildingPage = ({ buildings }) => {
	const { id } = useParams();
	const { user } = useAuth();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	interface Comment {
		name: string;
		text: string;
		createdAt: string;
	}

	const [comments, setComments] = useState<Comment[]>([]);
	const [formData, setFormData] = useState({
		name: user?.name,
		text: "",
	});

	const [buildingOption, setBuildingOption] = useState<string>("Materiály");

	const building = buildings.find((b) => b._id === id);

	const handleComment = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		const getComments = async () => {
			setLoading(true);

			try {
				const res = await api.get("/api/comments");

				setComments(res.data);
			} catch (err) {
				setError(err.response?.data.message);
			} finally {
				setLoading(false);
			}
		};

		getComments();
	}, []);

	console.log(formData);
	const saveComment = async (e) => {
		e.preventDefault();
		if (!formData.text.trim()) return;
		setLoading(true);

		try {
			const res = await api.post("/api/comments", {
				name: formData.name,
				text: formData.text.trim(),
			});

			setComments((prev) => [...prev, res.data]);

			setFormData((prev) => ({ ...prev, text: "" }));
		} catch (err) {
			setError(err.response?.data.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="building-page">
			<div style={{ display: "flex", gap: 5 }}>
				<button
					onClick={() => setBuildingOption("Materiály")}
					className={classNames("building-page__btn", {
						"building-page__btn--active": buildingOption == "Materiály",
					})}
				>
					Materiály
				</button>
				<button
					onClick={() => setBuildingOption("Harmonogram")}
					className={classNames("building-page__btn", {
						"building-page__btn--active": buildingOption == "Harmonogram",
					})}
				>
					Harmonogram
				</button>
			</div>
			{buildingOption === "Materiály" ? (
				<>
					<OrderedAndPurchasedItems id={id} building={building} />
					<section className="section">
						<p style={{ fontWeight: 600 }}>Poznamky</p>
						<div
							style={{
								background: "var(--bg-clr)",
								padding: 10,
								borderRadius: 10,
							}}
						>
							{comments.map((comment, i) => {
								return (
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start",
										}}
										key={i}
									>
										<div>
											<p>{comment.name}</p>
											<p>{comment.text}</p>
										</div>
										<p>{comment.createdAt}</p>
									</div>
								);
							})}
						</div>
						{/* <AutoGrowTextArea/> */}
						<form onSubmit={saveComment}>
							<textarea
								onChange={(e) => handleComment(e)}
								value={formData.text}
								className="input"
								style={{ width: "100%" }}
								name="text"
								id=""
							></textarea>
							<button className="btn" type="submit">
								Save
							</button>
						</form>
						<StatusIndicator error={error} loading={loading} />
					</section>
				</>
			) : (
				<WorkSchedule id={id} building={building} />
			)}
		</main>
	);
};

export default BuildingPage;
