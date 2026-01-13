import { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import "./Plan.scss";

const emptyInput = () => ({
	// TODO: LEARN THIS
	id: crypto.randomUUID(),
	task: "",
	executor: "",
	priority: "",
});

const Plan = ({ allUsers }) => {
	const [plan, setPlan] = useState([emptyInput(), emptyInput(), emptyInput()]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleAddInput = () => {
		setPlan((prev) => [...prev, emptyInput()]);
	};

	const handlePlanInput = (id, name, value) => {
		setPlan((prev) =>
			prev.map((item) => (item.id === id ? { ...item, [name]: value } : item))
		);
	};

	useEffect(() => {
		const fetchPlanData = async () => {
			setError(null);
			setLoading(true);
			const token = localStorage.getItem("token");

			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/work/responsibilities/plan`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				if (res.data && res.data.length > 0) {
					setPlan(res.data);
				} else {
					setPlan([emptyInput()]);
				}
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchPlanData();
	}, []);

	const savePlanData = async () => {
		setError(null);
		setLoading(true);
		const token = localStorage.getItem("token");

		try {
			// TODO: LEARN THIS
			for (const item of plan) {
				if ((item.task && !item.executor) || (!item.task && item.executor)) {
					throw new Error(
						"Pokud vyplníte úkol, musíte uvést i řešitele (a naopak)."
					);
				}
			}

			await axios.put(
				`${import.meta.env.VITE_API_URL}/api/work/responsibilities/plan`,
				plan,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
		} catch (error) {
			// TODO: Catch throw new Error
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="plan">
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 10,
				}}
			>
				<p
					style={{
						fontWeight: 600,
						display: "flex",
						alignItems: "center",
						gap: 5,
					}}
				>
					Seznam úkolů / Plán na další dny
				</p>
				<button onClick={handleAddInput} className="responsibilities__btn">
					Pridat
				</button>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
				{plan.map((item) => {
					return (
						<div style={{ display: "flex", gap: 5 }}>
							<input
								className="plan__input"
								type="text"
								name="task"
								onChange={(e) =>
									handlePlanInput(item.id, e.target.name, e.target.value)
								}
								value={item.task}
								placeholder="Vypracujte plán práce a vyberte zhotovitele."
								onBlur={savePlanData}
							/>
							<select
								className="plan__input"
								name="executor"
								id=""
								onChange={(e) =>
									handlePlanInput(item.id, e.target.name, e.target.value)
								}
								value={item.executor}
								onBlur={savePlanData}
							>
								<option value="">Not selected</option>
								{allUsers.map((user) => {
									return <option value={user.name}>{user.name}</option>;
								})}
							</select>
							<select
								className={classNames("plan__input", {
									"priority--low": item.priority === "Nizká",
									"priority--medium": item.priority === "Střední",
									"priority--high": item.priority === "Vysoká",
								})}
								name="priority"
								id=""
								onChange={(e) =>
									handlePlanInput(item.id, e.target.name, e.target.value)
								}
								value={item.priority}
								onBlur={savePlanData}
							>
								<option style={{ background: "green" }} value="Nizká">
									Nizká
								</option>
								<option value="Střední">Střední</option>
								<option value="Vysoká">Vysoká</option>
							</select>
						</div>
					);
				})}
			</div>
			<StatusIndicator error={error} loading={loading} />
		</section>
	);
};

export default Plan;
