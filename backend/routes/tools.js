import express from "express";
import { protect } from "../middleware/auth.js";
import Tool from "./../models/Tool.js";

const router = express.Router();

router.put("/", protect, async (req, res) => {
	try {
		const tools = req.body;

		const validData = tools.filter(
			(tool) => tool.name && tool.name.trim() !== "",
		);

		// if (validData.length === 0) {
		// 	return res.status(400).json({ message: "No valid tool data provided" });
		// }

		// 2. Clear and Insert (Atomic-like)
		await Tool.deleteMany({});
		const newTools = await Tool.insertMany(validData);

		res.status(200).json(newTools);
	} catch (error) {
		console.error("Mongoose Error:", error.message);
		res.status(500).json({ message: error.message });
	}
});

router.get("/all", protect, async (req, res) => {
	try {
		const tools = await Tool.find({});

		res.status(200).json(tools);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
