import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		text: { type: String, required: true },
	},
	{ timestamps: true },
);

export default mongoose.model("Comment", commentSchema);
