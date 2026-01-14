import { useEffect, useRef } from "react";
import "./AutoGrowTextArea.scss";

const AutoGrowTextArea = ({
	value,
	handleChange,
	name,
	holder,
	blur,
	disable = false,
	customStyle = { background: "#fff" },
}) => {
	const autoGrowTextArea = useRef<HTMLTextAreaElement | null>(null);

	// TODO: LEARN THIS
	useEffect(() => {
		if (autoGrowTextArea.current) {
			autoGrowTextArea.current.style.height = "auto";
			autoGrowTextArea.current.style.height =
				autoGrowTextArea.current.scrollHeight + "px";
		}
	}, [value]);

	// FIXME:
	const handleTextArea = (e) => {
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
	};

	return (
		<textarea
			ref={autoGrowTextArea}
			className="auto-grow-text-area"
			style={customStyle}
			name={name}
			value={value}
			onChange={(e) => {
				handleChange(e);
				handleTextArea(e);
			}}
			placeholder={holder}
			onBlur={blur}
			disabled={disable}
			rows={1}
		></textarea>
	);
};

export default AutoGrowTextArea;
