import { useEffect, useState } from "react";
import logo from "/logo/logo-black.png";
import "./Preload.scss";

const Preload = ({ loading }) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (!loading) {
			setProgress(100);
			return;
		}

		const duration = 30000; // 30 seconds
		// TODO: LEARN THIS
		const start = performance.now();
		let raf;

		const update = (now) => {
			const elapsed = now - start;
			const percent = Math.min((elapsed / duration) * 100, 100);

			setProgress(Math.floor(percent));

			if (elapsed < duration) {
				raf = requestAnimationFrame(update);
			}
		};

		raf = requestAnimationFrame(update);

		return () => cancelAnimationFrame(raf);
	}, [loading]);

	return (
		<div className="preload">
			<img src={logo} width={128} height={128} alt="NERESEN a.s. logo" />
			<span className="preload__indicator">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						mixBlendMode: "difference",
						color: "white",
					}}
				>
					<span>Načítání...</span>
					<span>{progress + "%"}</span>
				</div>
				<span
					style={{ width: `${progress}%` }}
					className="preload__indicator-progress"
				></span>
			</span>
		</div>
	);
};

export default Preload;
