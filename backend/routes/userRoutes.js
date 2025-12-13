import express from "express";
import User from "../models/User.js";

const router = express.Router();

const getDayStart = (date = new Date()) => new Date(date.setHours(0, 0, 0, 0));

router.get("/", async (req, res) => {
	try {
		const info = await User.find({});
		res.status(200).json(info || []);
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

router.put("/", async (req, res) => {
	try {
		const day = getDayStart(
			req.body.date ? new Date(req.body.date) : new Date()
		);

		const info = await User.findOneAndUpdate(
			{ date: day },
			{
				$set: {
					people: req.body.people,
				},
				$setOnInsert: {
					date: day,
				},
			},
			{
				new: true,
				upsert: true,
				setDefaultsOnInsert: true,
			}
		);

		res.status(200).json(info);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
