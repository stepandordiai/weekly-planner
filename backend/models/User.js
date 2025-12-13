import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		date: { type: Date, required: true, unique: true },
		people: [
			{
				name: { type: String, required: true },
				notes: { type: String, required: false },
			},
		],
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
