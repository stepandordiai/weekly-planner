import express from "express";
import Comment from "../models/Comment.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
	try {
		const { name, text } = req.body;

		if (!name || !text) {
			return res.status(400).json({ message: "Zadejte název" });
		}

		const comment = await Comment.create({
			name,
			text,
		});

		res.status(201).json(comment);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

router.get("/", protect, async (req, res) => {
	try {
		const comments = await Comment.find();

		res.json(comments);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
