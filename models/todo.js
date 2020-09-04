const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	description: String,
	author: String,
	completed: Boolean,
	container: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Container",
		},
	},
});

module.exports = mongoose.model("Todo", todoSchema);
