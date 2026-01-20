import express from "express";
import Building from "../models/Building.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.put("/:id/ordered-items", protect, async (req, res) => {
	try {
		const { id } = req.params;
		const orderedItemsArray = req.body;

		// if (!Array.isArray(orderedItemsArray)) {
		// 	return res
		// 		.status(400)
		// 		.json({ message: "Invalid responsibilities format" });
		// }

		const sanitized = orderedItemsArray
			.map((item) => ({
				desc: item.desc.trim(),
				orderOption: item.orderOption || "",
				orderDate: item.orderDate || "",
			}))
			.filter((item) => item.desc);

		const building = await Building.findById(id);

		if (!building) {
			return res.status(404).json({
				message: "Building not found",
			});
		}

		building.orderedItems = sanitized;
		await building.save();

		res.status(200).json({
			orderedItems: building.orderedItems,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Chyba při ukládání objednanich materialu" });
	}
});

router.get("/:id/ordered-items", protect, async (req, res) => {
	try {
		const { id } = req.params;

		const building = await Building.findById(id);

		if (!building) {
			return res.status(404).json({
				message: "Building not found",
			});
		}

		res.status(200).json(building.orderedItems);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Chyba při ukládání objednanich materialu" });
	}
});

//

router.put("/:id/purchased-items", protect, async (req, res) => {
	try {
		const { id } = req.params;
		const purchasedItemsArray = req.body;

		if (!Array.isArray(purchasedItemsArray)) {
			return res
				.status(400)
				.json({ message: "Invalid responsibilities format" });
		}

		const sanitized = purchasedItemsArray
			.filter(
				(item) => typeof item.desc === "string" && item.desc.trim() !== "",
			)
			.map((item) => ({
				desc: item.desc.trim(),
				purchaseOption: item.purchaseOption || "",
				purchaseDate: item.purchaseDate || "",
			}));

		const building = await Building.findById(id);

		if (!building) {
			return res.status(404).json({
				message: "Building not found",
			});
		}

		building.purchasedItems = sanitized;
		await building.save();

		res.status(200).json({
			purchasedItems: building.purchasedItems,
		});
	} catch (error) {
		res.status(500).json({ message: "Error in put request" });
	}
});

router.get("/:id/purchased-items", protect, async (req, res) => {
	try {
		const { id } = req.params;

		const building = await Building.findById(id);

		if (!building) {
			return res.status(404).json({
				message: "Building not found",
			});
		}

		res.status(200).json(building.purchasedItems);
	} catch (error) {
		res.status(500).json({ message: "Error in get request" });
	}
});

//

router.put("/:id/work-schedule", protect, async (req, res) => {
	try {
		const { id } = req.params;
		const workScheduleArray = req.body;

		if (!Array.isArray(workScheduleArray)) {
			return res.status(400).json({ message: "Invalid workSchedule format" });
		}

		const sanitized = workScheduleArray
			.map((item) => ({
				desc: item.desc.trim(),
				start: item.start || "",
				finish: item.finish || "",
				comment: item.comment || "",
			}))
			.filter((item) => item.desc);

		const building = await Building.findById(id);

		if (!building) {
			return res.status(404).json({
				message: "Building not found",
			});
		}

		building.workSchedule = sanitized;
		await building.save();

		res.status(200).json({
			workSchedule: building.workSchedule,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Chyba při ukládání objednanich materialu" });
	}
});

router.get("/:id/work-schedule", protect, async (req, res) => {
	try {
		const { id } = req.params;

		const building = await Building.findById(id);

		if (!building) {
			return res.status(404).json({
				message: "Building not found",
			});
		}

		res.status(200).json(building.workSchedule);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Chyba při ukládání objednanich materialu" });
	}
});

export default router;
