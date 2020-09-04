const mongoose = require("mongoose");

const containerSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	name: String,
	position: Number,
	todos: [
		{
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Todo",
			},
		},
	],
	board: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Board",
	},
});

module.exports = mongoose.model("Container", containerSchema);
