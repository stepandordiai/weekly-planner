// TODO: LEARN THIS
const dateToDayName = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString("cs-CZ", { weekday: "long" });
};

export default dateToDayName;
