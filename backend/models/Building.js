import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			required: true,
		},
	},
	{ timestamps: true }
);

const Building = mongoose.model("Building", buildingSchema);

export default Building;
