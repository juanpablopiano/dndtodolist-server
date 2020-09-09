const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	description: String,
	author: String,
	completed: {
		type: Boolean,
		default: false,
	},
	container: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Container",
	},
});

module.exports = mongoose.model("Todo", todoSchema);
