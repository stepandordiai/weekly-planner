import "./Visit.scss";
import ClockIcon from "../../icons/ClockIcon";
import { useRef, useState } from "react";

const Visit = () => {
	const enterInput = useRef<HTMLSpanElement | null>(null);
	const exitInput = useRef<HTMLSpanElement | null>(null);
	const intervalRef = useRef<number>(null);
	const [startActive, setStartActive] = useState(false);
	const [timer, setTimer] = useState("00:00:00");
	const [isFinished, setIsFinished] = useState(false);

	const today = new Date();

	const dateString = today.toISOString().split("T")[0];

	const handleStart = () => {
		const startTime = new Date(); // Full date object of start time

		const hours = startTime.getHours().toString().padStart(2, "0");
		const minutes = startTime.getMinutes().toString().padStart(2, "0");

		setStartActive(true);
		if (enterInput.current) {
			enterInput.current.textContent = `${hours}:${minutes}`;
		}

		// Store the interval ID so you can stop it later!
		intervalRef.current = setInterval(() => {
			const now = new Date();

			// 1. Get difference in total milliseconds
			let diffInMs = Number(now) - Number(startTime);

			// 2. Convert ms to total hours, minutes, seconds
			let totalSeconds = Math.floor(diffInMs / 1000);
			let totalMinutes = Math.floor(totalSeconds / 60);
			let totalHours = Math.floor(totalMinutes / 60);

			// 3. Use remainder (%) to keep values between 0-59
			const displayS = (totalSeconds % 60).toString().padStart(2, "0");
			const displayM = (totalMinutes % 60).toString().padStart(2, "0");
			const displayH = totalHours.toString().padStart(2, "0");

			setTimer(`${displayH}:${displayM}:${displayS}`);
		}, 1000);
	};

	const handleStop = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = null;

		setStartActive(false);
		setIsFinished(true);

		// 3. Optional: Capture the end time
		const endTime = new Date();
		const endHours = endTime.getHours().toString().padStart(2, "0");
		const endMinutes = endTime.getMinutes().toString().padStart(2, "0");

		if (exitInput.current) {
			exitInput.current.textContent = `${endHours}:${endMinutes}`;
		}
	};

	return (
		<div className="visit">
			<p
				style={{
					fontWeight: 600,
					display: "flex",
					alignItems: "center",
					gap: 5,
					marginBottom: 10,
				}}
			>
				<ClockIcon size={16} />
				<span>Dochazka</span>
			</p>
			<div
				className="visit-container"
				style={{ display: "flex", justifyContent: "space-between" }}
			>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
					<div className="visit-input-container">
						<span>Datum</span>
						<input
							style={{
								border: "1px solid rgba(0, 0, 0, 0.2)",
								borderRadius: 10,
								padding: 5,
							}}
							defaultValue={dateString}
							type="date"
						/>
					</div>
					<div className="visit-input-container">
						<span>Prichod</span>
						<span
							style={{
								border: "1px solid rgba(0, 0, 0, 0.2)",
								borderRadius: 10,
								padding: 5,
								textAlign: "center",
								minWidth: 80,
							}}
							ref={enterInput}
						>
							00:00
						</span>
					</div>
					<div className="visit-input-container">
						<span>Odchod</span>
						<span
							style={{
								border: "1px solid rgba(0, 0, 0, 0.2)",
								borderRadius: 10,
								padding: 5,
								textAlign: "center",
								minWidth: 80,
							}}
							ref={exitInput}
						>
							00:00
						</span>
					</div>
					<div className="visit-input-container">
						<span>Odpracovano</span>
						<p
							style={{
								border: "1px solid rgba(0, 0, 0, 0.2)",
								borderRadius: 10,
								padding: 5,
								textAlign: "center",
								minWidth: 80,
							}}
						>
							{timer}
						</p>
					</div>
				</div>
				<div
					style={{
						marginLeft: "auto",
						display: "flex",
						justifyContent: "flex-end",
						flexWrap: "wrap",
						gap: 5,
					}}
				>
					<button
						onClick={handleStart}
						className="visit-input__btn-start"
						disabled={startActive || isFinished}
						style={
							startActive || isFinished
								? { cursor: "not-allowed", opacity: 0.5 }
								: { cursor: "pointer" }
						}
					>
						Start
					</button>
					<button
						onClick={handleStop}
						className="visit-input__btn-stop"
						disabled={!startActive}
						style={
							!startActive
								? { cursor: "not-allowed", opacity: 0.5 }
								: { cursor: "pointer" }
						}
					>
						Stop
					</button>
				</div>
			</div>
		</div>
	);
};

export default Visit;
