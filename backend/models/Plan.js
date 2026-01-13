import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
	{
		task: String,
		executor: String,
		priority: String,
	},
	{ timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
