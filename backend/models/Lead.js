import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
	{
		tel: { type: String, required: true },
	},
	{ timestamps: true },
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
