import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import api from "../../axios";
import StatusIndicator from "../../components/StatusIndicator/StatusIndicator";
import "./BuildingPage.scss";

const emptyInput = () => ({
	// TODO: LEARN THIS
	id: crypto.randomUUID(),
	desc: "",
	orderOption: "",
	orderDate: "",
});

const purchasedItemsemptyInput = () => ({
	// TODO: LEARN THIS
	id: crypto.randomUUID(),
	desc: "",
	purchaseOption: "",
	purchaseDate: "",
});

const workScheduleEmptyInput = () => ({
	id: crypto.randomUUID(),
	desc: "",
	start: "",
	finish: "",
	comment: "",
});

const BuildingPage = ({ buildings }) => {
	const { id } = useParams();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [orderedItems, setOrderedItems] = useState([
		emptyInput(),
		emptyInput(),
		emptyInput(),
	]);
	const [purchasedItems, setPurchasedItems] = useState([
		purchasedItemsemptyInput(),
		purchasedItemsemptyInput(),
		purchasedItemsemptyInput(),
	]);
	const [workSchedule, setWorkSchedule] = useState([
		workScheduleEmptyInput(),
		workScheduleEmptyInput(),
		workScheduleEmptyInput(),
	]);

	const [buildingOption, setBuildingOption] = useState<string>("Materiály");

	const building = buildings.find((b) => b._id === id);

	const handleOrderedItems = (id, name, value) => {
		if (name === "orderOption" && value === "Dodáno") {
			setOrderedItems((prevOrdered) => {
				const itemToMove = prevOrdered.find((item) => item.id === id);
				if (!itemToMove) return prevOrdered;

				// Remove from ordered list
				const updatedOrdered = prevOrdered.filter((item) => item.id !== id);

				// 🔥 SAVE ordered items immediately
				saveOrderedItemsData(updatedOrdered);

				setPurchasedItems((prevPurchased) => {
					if (prevPurchased.some((p) => p.desc === itemToMove.desc)) {
						return prevPurchased;
					}

					const updated = [
						...prevPurchased,
						{
							id: crypto.randomUUID(),
							desc: itemToMove.desc,
							purchaseOption: value,
							purchaseDate: itemToMove.orderDate || "",
						},
					];

					savePurchasedData(
						updated.map(({ desc, purchaseOption, purchaseDate }) => ({
							desc,
							purchaseOption,
							purchaseDate,
						})),
					);

					return updated;
				});

				return updatedOrdered;
			});
		} else {
			setOrderedItems((prev) =>
				prev.map((item) =>
					item.id === id ? { ...item, [name]: value } : item,
				),
			);
		}
	};

	const handlePurchasedItems = (id, name, value) => {
		if (name === "purchaseOption" && value !== "Dodáno") {
			setPurchasedItems((prevPurchased) => {
				const itemToMove = prevPurchased.find((item) => item.id === id);
				if (!itemToMove) return prevPurchased;

				// Remove from ordered list
				const updatedPurchased = prevPurchased.filter((item) => item.id !== id);

				// 🔥 SAVE ordered items immediately
				savePurchasedData(updatedPurchased);

				setOrderedItems((prevOrdered) => {
					if (prevOrdered.some((p) => p.desc === itemToMove.desc)) {
						return prevOrdered;
					}

					const updated = [
						...prevOrdered,
						{
							id: crypto.randomUUID(),
							desc: itemToMove.desc,
							orderOption: value,
							orderDate: itemToMove.purchaseDate || "",
						},
					];

					saveOrderedItemsData(
						updated.map(({ desc, orderOption, orderDate }) => ({
							desc,
							orderOption,
							orderDate,
						})),
					);

					return updated;
				});

				return updatedPurchased;
			});
		} else {
			setPurchasedItems((prev) =>
				prev.map((item) =>
					item.id === id ? { ...item, [name]: value } : item,
				),
			);
		}
	};

	useEffect(() => {
		const fetchPurchasedItemsData = async () => {
			try {
				const res = await api.get(
					`/api/building/${building._id}/purchased-items`,
				);

				const updated = res.data.map((item) => ({
					id: crypto.randomUUID(),
					desc: item.desc,
					purchaseOption: item.purchaseOption,
					purchaseDate: item.purchaseDate,
				}));

				// TODO: LEARN THIS
				const filled = [...updated];

				while (filled.length < 3) {
					filled.push(purchasedItemsemptyInput());
				}

				setPurchasedItems(filled);
			} catch (err) {
				setError(err.response.data.message);
			}
		};

		fetchPurchasedItemsData();
	}, [id]);

	const savePurchasedData = async (data) => {
		setLoading(true);
		setError(null);
		try {
			const res = await api.put(
				`/api/building/${building._id}/purchased-items`,
				data,
			);

			const updated = res.data.purchasedItems.map((item) => ({
				id: crypto.randomUUID(), // ✅ ALWAYS add
				desc: item.desc,
				purchaseDate: item.purchaseDate,
				purchaseOption: item.purchaseOption || "",
			}));

			setPurchasedItems(updated);
		} catch (err) {
			setError(err.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	const handleWorkSchedule = (id, name, value) => {
		setWorkSchedule((prev) =>
			prev.map((item) => (item.id === id ? { ...item, [name]: value } : item)),
		);
	};

	useEffect(() => {
		const fetchOrderedItemsData = async () => {
			setLoading(true);
			setError(null);

			try {
				const res = await api.get(
					`/api/building/${building._id}/ordered-items`,
				);

				const updated = res.data.map((item) => ({
					id: crypto.randomUUID(),
					desc: item.desc,
					orderOption: item.orderOption,
					orderDate: item.orderDate,
				}));

				// TODO: LEARN THIS
				const filled = [...updated];

				while (filled.length < 3) {
					filled.push(emptyInput());
				}

				setOrderedItems(filled);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchOrderedItemsData();

		const fetchWorkSchedule = async () => {
			setLoading(true);
			setError(null);

			try {
				const res = await api.get(
					`/api/building/${building._id}/work-schedule`,
				);

				const updated = res.data.map((item) => ({
					id: crypto.randomUUID(),
					desc: item.desc,
					start: item.start,
					finish: item.finish,
					comment: item.comment,
				}));

				// TODO: LEARN THIS
				const filled = [...updated];

				while (filled.length < 3) {
					filled.push(workScheduleEmptyInput());
				}

				setWorkSchedule(filled);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchWorkSchedule();
	}, [id]);

	const saveOrderedItemsData = async (data) => {
		setLoading(true);
		setError(null);

		try {
			await api.put(`/api/building/${building._id}/ordered-items`, data);

			// setOrderedItems(res.data.orderedItems);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const saveWorkSchedule = async () => {
		setLoading(true);
		setError(null);

		try {
			await api.put(
				`/api/building/${building._id}/work-schedule`,
				workSchedule,
			);

			// setWorkSchedule(res.data.workSchedule);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const addEmptyInput = () =>
		setOrderedItems((prev) => [...prev, emptyInput()]);

	const addWorkSchedule = () =>
		setWorkSchedule((prev) => [...prev, workScheduleEmptyInput()]);

	console.log("ORDER", orderedItems);
	console.log("PURCHASE", purchasedItems);

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
					<section className="section-table">
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "cnter",
							}}
						>
							<h2 style={{ margin: "5px 0 0 5px ", fontWeight: 600 }}>
								Objednané materiály
							</h2>
							<button
								onClick={addEmptyInput}
								style={{ margin: "5px 5px 0 0" }}
								className="btn"
							>
								Pridat
							</button>
						</div>
						<table>
							<thead>
								<tr>
									<th>Popis</th>
									<th>Objednáno</th>
									<th>Termín dodání</th>
								</tr>
							</thead>
							<tbody>
								{orderedItems.map((orderedItem) => {
									return (
										<tr key={orderedItem.id}>
											<td>
												<input
													onBlur={() => saveOrderedItemsData(orderedItems)}
													onChange={(e) =>
														handleOrderedItems(
															orderedItem.id,
															e.target.name,
															e.target.value,
														)
													}
													value={orderedItem.desc}
													name="desc"
													style={{ width: "100%" }}
													className="input"
													type="text"
												/>
											</td>
											<td>
												<select
													onBlur={() => saveOrderedItemsData(orderedItems)}
													onChange={(e) =>
														handleOrderedItems(
															orderedItem.id,
															e.target.name,
															e.target.value,
														)
													}
													value={orderedItem.orderOption}
													name="orderOption"
													className={classNames("input", {
														"input--green":
															orderedItem.orderOption === "S dopravou",
														"input--orange":
															orderedItem.orderOption === "K výzvednutí",
														"input--red": orderedItem.orderOption === "Poptáno",
														"input--blue": orderedItem.orderOption === "Dodáno",
													})}
													id=""
												>
													<option value="">Nezvoleno</option>
													<option className="input--green" value="S dopravou">
														S dopravou
													</option>
													<option
														className="input--orange"
														value="K výzvednutí"
													>
														K výzvednutí
													</option>
													<option className="input--red" value="Poptáno">
														Poptáno
													</option>
													<option className="input--blue" value="Dodáno">
														Dodáno
													</option>
												</select>
											</td>
											<td>
												<input
													onBlur={() => saveOrderedItemsData(orderedItems)}
													onChange={(e) =>
														handleOrderedItems(
															orderedItem.id,
															e.target.name,
															e.target.value,
														)
													}
													value={orderedItem.orderDate}
													name="orderDate"
													style={{ width: "100%" }}
													className="input"
													type="date"
												/>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						<StatusIndicator error={error} loading={loading} />
					</section>
					{/*  */}
					<section className="section-table">
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "cnter",
							}}
						>
							<h2 style={{ margin: "5px 0 0 5px ", fontWeight: 600 }}>
								Dodané materiály
							</h2>
							<button
								onClick={addEmptyInput}
								style={{ margin: "5px 5px 0 0" }}
								className="btn"
							>
								Pridat
							</button>
						</div>
						<table>
							<thead>
								<tr>
									<th>Popis</th>
									<th></th>
									<th>Termín dodání</th>
								</tr>
							</thead>
							<tbody>
								{purchasedItems.map((purchasedItem) => {
									return (
										<tr key={purchasedItem.id}>
											<td>
												<input
													onBlur={() => savePurchasedData(purchasedItems)}
													onChange={(e) =>
														handlePurchasedItems(
															purchasedItem.id,
															e.target.name,
															e.target.value,
														)
													}
													value={purchasedItem.desc}
													name="desc"
													style={{ width: "100%" }}
													className="input"
													type="text"
												/>
											</td>
											<td>
												<select
													onBlur={() => savePurchasedData(purchasedItems)}
													onChange={(e) =>
														handlePurchasedItems(
															purchasedItem.id,
															e.target.name,
															e.target.value,
														)
													}
													value={purchasedItem.purchaseOption}
													name="purchaseOption"
													className={classNames("input", {
														"input--green":
															purchasedItem.purchaseOption === "S dopravou",
														"input--orange":
															purchasedItem.purchaseOption === "K výzvednutí",
														"input--red":
															purchasedItem.purchaseOption === "Poptáno",
														"input--blue":
															purchasedItem.purchaseOption === "Dodáno",
													})}
													id=""
												>
													<option value="">Nezvoleno</option>
													<option className="input--green" value="S dopravou">
														S dopravou
													</option>
													<option
														className="input--orange"
														value="K výzvednutí"
													>
														K výzvednutí
													</option>
													<option className="input--red" value="Poptáno">
														Poptáno
													</option>
													<option className="input--blue" value="Dodáno">
														Dodáno
													</option>
												</select>
											</td>
											<td>
												<input
													onBlur={() => savePurchasedData(purchasedItems)}
													onChange={(e) =>
														handlePurchasedItems(
															purchasedItem.id,
															e.target.name,
															e.target.value,
														)
													}
													value={purchasedItem.purchaseDate}
													name="purchaseDate"
													style={{ width: "100%" }}
													className="input"
													type="date"
												/>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						<StatusIndicator error={error} loading={loading} />
					</section>
				</>
			) : (
				<section className="section-table">
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "cnter",
						}}
					>
						<h2 style={{ margin: "5px 0 0 5px ", fontWeight: 600 }}>
							Časový harmonogram prací
						</h2>
						<button
							onClick={addWorkSchedule}
							style={{ margin: "5px 5px 0 0" }}
							className="btn"
						>
							Pridat
						</button>
					</div>
					<table>
						<thead>
							<tr>
								<th>Popis etapy / činnosti</th>
								<th>Zahájeni</th>
								<th>Dokončeni</th>
								<th>Poznámky</th>
							</tr>
						</thead>
						<tbody>
							{workSchedule.map((item) => {
								return (
									<tr key={item.id}>
										<td>
											<input
												className="input"
												onChange={(e) =>
													handleWorkSchedule(
														item.id,
														e.target.name,
														e.target.value,
													)
												}
												style={{ width: "100%" }}
												name="desc"
												value={item.desc}
												type="text"
												onBlur={saveWorkSchedule}
											/>
										</td>
										<td>
											<input
												onChange={(e) =>
													handleWorkSchedule(
														item.id,
														e.target.name,
														e.target.value,
													)
												}
												className="input"
												name="start"
												value={item.start}
												type="date"
												onBlur={saveWorkSchedule}
											/>
										</td>
										<td>
											<input
												onChange={(e) =>
													handleWorkSchedule(
														item.id,
														e.target.name,
														e.target.value,
													)
												}
												className="input"
												name="finish"
												value={item.finish}
												type="date"
												onBlur={saveWorkSchedule}
											/>
										</td>
										<td>
											<input
												onChange={(e) =>
													handleWorkSchedule(
														item.id,
														e.target.name,
														e.target.value,
													)
												}
												className="input"
												name="comment"
												value={item.comment}
												type="text"
												onBlur={saveWorkSchedule}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					<StatusIndicator error={error} loading={loading} />
				</section>
			)}
		</main>
	);
};

export default BuildingPage;
