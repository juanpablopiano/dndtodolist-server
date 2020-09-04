const mongoose = require("mongoose");
const { model } = require("./todo");

const boardSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	name: String,
	author: String,
	containers: [
		{
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Container",
			},
		},
	],
	descríption: String,
});

module.exports = mongoose.model("Board", boardSchema);
