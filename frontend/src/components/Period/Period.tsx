import dateToDayName from "../../utils/dateToDayName";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import api from "../../axios";
import "./Period.scss";
import StatusIndicator from "../StatusIndicator/StatusIndicator";

const Period = ({ allUsers, userId }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [dateRange, setDateRange] = useState({
		startDate: "",
		endDate: "",
	});
	const [data, setData] = useState([]);

	const handleDateRange = (name, value) => {
		setDateRange((prev) => ({ ...prev, [name]: value }));
	};

	const currentUser = allUsers.find((user) => user._id === userId);

	const fetchDataRange = async () => {
		setLoading(true);
		setError(null);

		try {
			const res = await api.get(
				`/api/work/responsibilities/date-range/${userId}`,
				{
					params: {
						startDate: dateRange.startDate,
						endDate: dateRange.endDate,
					},
				},
			);

			setData(res.data);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	console.log(error);

	// PDF

	const pdfRef = useRef<HTMLDivElement>(null);

	// TODO: LEARN THIS
	const exportPDF = async () => {
		if (!pdfRef.current) return;

		const pdf = new jsPDF("p", "mm", "a4");

		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();

		const margin = 5;
		const contentWidth = pageWidth - margin * 2;
		let yOffset = margin;

		const blocks = pdfRef.current.querySelectorAll(".pdf-avoid-break");

		for (let i = 0; i < blocks.length; i++) {
			const block = blocks[i] as HTMLElement;

			const canvas = await html2canvas(block, {
				scale: 1,
				useCORS: true,
			});

			const imgData = canvas.toDataURL("image/png");
			const imgHeight = (canvas.height * contentWidth) / canvas.width;

			// 🔥 NEW PAGE if block doesn't fit
			if (yOffset + imgHeight > pageHeight - margin) {
				pdf.addPage();
				yOffset = margin;
			}

			pdf.addImage(imgData, "PNG", margin, yOffset, contentWidth, imgHeight);

			yOffset += imgHeight + 1; // spacing between blocks
		}

		pdf.save("export.pdf");
	};

	return (
		<>
			<button onClick={exportPDF} className="weekbar__pdf">
				Export PDF
			</button>
			<section ref={pdfRef} id="pdf-content" className="section">
				<div
					className="pdf-avoid-break"
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 5,
						alignItems: "flex-start",
					}}
				>
					<p style={{ fontSize: "2rem" }}>{currentUser.name}</p>
					<p>Období</p>
					<div>
						<label htmlFor="">Od </label>
						<input
							className="input"
							type="date"
							onChange={(e) => handleDateRange(e.target.name, e.target.value)}
							name="startDate"
							value={dateRange.startDate}
						/>
					</div>
					<div>
						<label htmlFor="">Do </label>
						<input
							className="input"
							onChange={(e) => handleDateRange(e.target.name, e.target.value)}
							name="endDate"
							type="date"
							value={dateRange.endDate}
						/>
					</div>
					<button className="btn" onClick={fetchDataRange}>
						Získat data
					</button>
				</div>
				{data.length === 0 ? (
					"No data"
				) : (
					<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
						{data.map((item, i) => {
							return (
								<div
									className="pdf-avoid-break"
									key={i}
									style={{
										display: "flex",
										flexDirection: "column",
										gap: 5,
										width: "100%",
										background: "var(--bg-clr)",
										padding: 10,
										borderRadius: 10,
									}}
								>
									<p
										style={{
											width: "max-content",
										}}
										className="input"
									>
										{dateToDayName(item.date)} | {item.date}
									</p>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: 5,
											flexGrow: 1,
										}}
									>
										{item.responsibilities.length < 1 ? (
											<div key={i} style={{ display: "flex", gap: 5 }}>
												<p
													style={{ width: "100%", flexGrow: 1 }}
													className="input"
												>
													Žádná data
												</p>
												<p style={{ whiteSpace: "nowrap" }} className="input">
													--:--
												</p>
											</div>
										) : (
											<>
												{item.responsibilities.map((responsibility, i) => {
													return (
														<div key={i} style={{ display: "flex", gap: 5 }}>
															<p
																style={{ width: "100%", flexGrow: 1 }}
																className="input"
															>
																{responsibility.task}
															</p>
															<p
																style={{ whiteSpace: "nowrap" }}
																className="input"
															>
																{responsibility.time || "--:--"}
															</p>
														</div>
													);
												})}
											</>
										)}

										<div style={{ display: "flex", marginTop: "auto", gap: 5 }}>
											<div>
												<p>Prichod</p>
												<p className="input">{item.startTime || "--:--"}</p>
											</div>
											<div>
												<p>Odchod</p>
												<p className="input">{item.endTime || "--:--"}</p>
											</div>
											<div>
												<p>Pauza</p>
												<p className="input">{item.pauseTime || "--:--"}</p>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
				<StatusIndicator error={error} loading={loading} />
			</section>
		</>
	);
};

export default Period;
